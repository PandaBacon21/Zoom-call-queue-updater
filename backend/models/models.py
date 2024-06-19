from app import db


class Token(db.Model):
    __tablename__ = 'token'
    
    id = db.Column(db.Integer, primary_key=True)
    access_token = db.Column(db.String(1000), unique=False, nullable=False)
    token_expires = db.Column(db.DateTime, unique=False, nullable=False)

