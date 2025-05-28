from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__, static_folder='../../frontend/build')
    app.config.from_object(config_class)
    
    # Initialize CORS with more permissive settings for development
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000", "http://localhost:5000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Register blueprints
    from .routes import main, api, seat_allocation
    app.register_blueprint(main.bp)
    app.register_blueprint(api.bp, url_prefix='/api')
    app.register_blueprint(seat_allocation.bp, url_prefix='/api/generate-seat-allocation')
    
    # Register error handlers
    from .errors import register_error_handlers
    register_error_handlers(app)
    
    return app