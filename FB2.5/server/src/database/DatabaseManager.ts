import { Pool, PoolClient } from 'pg';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

export class DatabaseManager {
  private pool: Pool;
  private isConnected: boolean = false;

  constructor() {
    this.pool = new Pool({
      host: config.DB_HOST,
      port: config.DB_PORT,
      database: config.DB_NAME,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
      maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.pool.on('connect', (client) => {
      logger.debug('New database client connected');
    });

    this.pool.on('error', (err, client) => {
      logger.error('Unexpected error on idle database client', err);
    });

    this.pool.on('remove', (client) => {
      logger.debug('Database client removed');
    });
  }

  public async initialize(): Promise<void> {
    try {
      // Test the connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      
      this.isConnected = true;
      logger.info('Database connection established successfully');
      
      // Run migrations
      await this.runMigrations();
      
    } catch (error) {
      logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  public async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      logger.debug('Executed query', {
        text: text.substring(0, 100),
        duration: `${duration}ms`,
        rows: result.rowCount
      });
      
      return result.rows;
    } catch (error) {
      logger.error('Database query error:', {
        text: text.substring(0, 100),
        error: error.message,
        params
      });
      throw error;
    }
  }

  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async runMigrations(): Promise<void> {
    try {
      // Create migrations table if it doesn't exist
      await this.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Run initial schema migration
      await this.createInitialSchema();
      
      logger.info('Database migrations completed successfully');
    } catch (error) {
      logger.error('Migration failed:', error);
      throw error;
    }
  }

  private async createInitialSchema(): Promise<void> {
    const migrationName = '001_initial_schema';
    
    // Check if migration already ran
    const existing = await this.query(
      'SELECT id FROM migrations WHERE name = $1',
      [migrationName]
    );
    
    if (existing.length > 0) {
      logger.info('Initial schema migration already applied');
      return;
    }

    // Create all tables
    await this.query(`
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        avatar_url TEXT,
        timezone VARCHAR(50) DEFAULT 'UTC',
        preferences JSONB DEFAULT '{}',
        is_verified BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- User profiles table
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        productivity_score INTEGER DEFAULT 0,
        global_rank INTEGER,
        focus_streak INTEGER DEFAULT 0,
        total_focus_time INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        experience_points INTEGER DEFAULT 0,
        avatar_data JSONB DEFAULT '{}',
        cottage_data JSONB DEFAULT '{}',
        achievements JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Activity sessions table
      CREATE TABLE IF NOT EXISTS activity_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        url TEXT,
        title TEXT,
        domain VARCHAR(255),
        category VARCHAR(100),
        subcategory VARCHAR(100),
        productivity_score INTEGER,
        focus_quality INTEGER,
        duration INTEGER NOT NULL,
        distractions INTEGER DEFAULT 0,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Wellness data table
      CREATE TABLE IF NOT EXISTS wellness_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        sleep_hours DECIMAL(3,1),
        sleep_quality INTEGER,
        water_intake INTEGER,
        exercise_minutes INTEGER,
        weight DECIMAL(5,2),
        mood_rating INTEGER,
        stress_level INTEGER,
        nutrition_score INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, date)
      );

      -- Flashcard decks table
      CREATE TABLE IF NOT EXISTS flashcard_decks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        emoji VARCHAR(10),
        color VARCHAR(7),
        is_public BOOLEAN DEFAULT false,
        tags JSONB DEFAULT '[]',
        settings JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Flashcards table
      CREATE TABLE IF NOT EXISTS flashcards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        deck_id UUID REFERENCES flashcard_decks(id) ON DELETE CASCADE,
        term TEXT NOT NULL,
        definition TEXT NOT NULL,
        phonetic VARCHAR(255),
        audio_url TEXT,
        image_url TEXT,
        difficulty INTEGER DEFAULT 1,
        tags JSONB DEFAULT '[]',
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Flashcard reviews table
      CREATE TABLE IF NOT EXISTS flashcard_reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        card_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL,
        response_time INTEGER,
        review_type VARCHAR(50),
        next_review_date TIMESTAMP,
        ease_factor DECIMAL(3,2) DEFAULT 2.5,
        interval_days INTEGER DEFAULT 1,
        repetitions INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Goals table
      CREATE TABLE IF NOT EXISTS goals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        target_value DECIMAL(10,2),
        current_value DECIMAL(10,2) DEFAULT 0,
        unit VARCHAR(50),
        deadline DATE,
        is_completed BOOLEAN DEFAULT false,
        priority INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Notifications table
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        data JSONB DEFAULT '{}',
        is_read BOOLEAN DEFAULT false,
        is_sent BOOLEAN DEFAULT false,
        scheduled_for TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Leaderboard entries table
      CREATE TABLE IF NOT EXISTS leaderboard_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(100) NOT NULL,
        period VARCHAR(50) NOT NULL,
        score INTEGER NOT NULL,
        rank INTEGER,
        data JSONB DEFAULT '{}',
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, category, period, date)
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_activity_sessions_user_id ON activity_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_activity_sessions_start_time ON activity_sessions(start_time);
      CREATE INDEX IF NOT EXISTS idx_wellness_data_user_date ON wellness_data(user_id, date);
      CREATE INDEX IF NOT EXISTS idx_flashcard_reviews_user_id ON flashcard_reviews(user_id);
      CREATE INDEX IF NOT EXISTS idx_flashcard_reviews_next_review ON flashcard_reviews(next_review_date);
      CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_leaderboard_category_period ON leaderboard_entries(category, period, date);

      -- Create updated_at trigger function
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Create triggers for updated_at
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      CREATE TRIGGER update_flashcard_decks_updated_at BEFORE UPDATE ON flashcard_decks
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      CREATE TRIGGER update_flashcards_updated_at BEFORE UPDATE ON flashcards
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    // Record migration
    await this.query(
      'INSERT INTO migrations (name) VALUES ($1)',
      [migrationName]
    );

    logger.info('Initial schema migration completed');
  }

  public async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
      logger.info('Database connection closed');
    }
  }

  public get connected(): boolean {
    return this.isConnected;
  }
}