import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { config } from './config/environment';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { DatabaseManager } from './database/DatabaseManager';
import { RedisManager } from './cache/RedisManager';

// Route imports
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import activityRoutes from './routes/activity';
import analyticsRoutes from './routes/analytics';
import flashcardRoutes from './routes/flashcards';
import wellnessRoutes from './routes/wellness';
import leaderboardRoutes from './routes/leaderboard';
import notificationRoutes from './routes/notifications';

// Service imports
import { RealTimeService } from './services/RealTimeService';
import { AnalyticsService } from './services/AnalyticsService';
import { NotificationService } from './services/NotificationService';

class FocusBoostServer {
  private app: express.Application;
  private server: any;
  private io: SocketIOServer;
  private dbManager: DatabaseManager;
  private redisManager: RedisManager;
  private realTimeService: RealTimeService;
  private analyticsService: AnalyticsService;
  private notificationService: NotificationService;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST']
      }
    });

    this.initializeDatabase();
    this.initializeRedis();
    this.initializeServices();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSwagger();
    this.setupErrorHandling();
    this.setupSocketIO();
  }

  private async initializeDatabase(): Promise<void> {
    this.dbManager = new DatabaseManager();
    await this.dbManager.initialize();
    logger.info('Database initialized successfully');
  }

  private async initializeRedis(): Promise<void> {
    this.redisManager = new RedisManager();
    await this.redisManager.connect();
    logger.info('Redis connected successfully');
  }

  private initializeServices(): void {
    this.analyticsService = new AnalyticsService(this.dbManager, this.redisManager);
    this.notificationService = new NotificationService(this.dbManager, this.redisManager);
    this.realTimeService = new RealTimeService(this.io, this.analyticsService);
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: config.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Compression and parsing
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // Limit each IP to 1000 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Logging
    this.app.use(morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) }
    }));

    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.NODE_ENV
      });
    });
  }

  private setupRoutes(): void {
    const apiRouter = express.Router();

    // Public routes
    apiRouter.use('/auth', authRoutes);

    // Protected routes
    apiRouter.use('/users', authMiddleware, userRoutes);
    apiRouter.use('/activity', authMiddleware, activityRoutes);
    apiRouter.use('/analytics', authMiddleware, analyticsRoutes);
    apiRouter.use('/flashcards', authMiddleware, flashcardRoutes);
    apiRouter.use('/wellness', authMiddleware, wellnessRoutes);
    apiRouter.use('/leaderboard', authMiddleware, leaderboardRoutes);
    apiRouter.use('/notifications', authMiddleware, notificationRoutes);

    this.app.use('/api', apiRouter);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
      });
    });
  }

  private setupSwagger(): void {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'FocusBoost API',
          version: '1.0.0',
          description: 'Enterprise-grade productivity tracking API',
        },
        servers: [
          {
            url: `http://localhost:${config.PORT}`,
            description: 'Development server',
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      apis: ['./src/routes/*.ts', './src/models/*.ts'],
    };

    const specs = swaggerJsdoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private setupSocketIO(): void {
    this.io.use((socket, next) => {
      // Socket authentication middleware
      const token = socket.handshake.auth.token;
      if (token) {
        // Verify JWT token here
        next();
      } else {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);
      
      socket.on('join_user_room', (userId) => {
        socket.join(`user_${userId}`);
        logger.info(`User ${userId} joined their room`);
      });

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  public async start(): Promise<void> {
    try {
      this.server.listen(config.PORT, () => {
        logger.info(`🚀 FocusBoost API Server running on port ${config.PORT}`);
        logger.info(`📚 API Documentation: http://localhost:${config.PORT}/api-docs`);
        logger.info(`🏥 Health Check: http://localhost:${config.PORT}/health`);
        logger.info(`🌍 Environment: ${config.NODE_ENV}`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down server...');
    
    if (this.server) {
      this.server.close();
    }
    
    if (this.dbManager) {
      await this.dbManager.disconnect();
    }
    
    if (this.redisManager) {
      await this.redisManager.disconnect();
    }
    
    logger.info('Server shutdown complete');
  }
}

// Initialize and start server
const server = new FocusBoostServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  await server.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await server.shutdown();
  process.exit(0);
});

// Start the server
server.start().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export default server;