from db import Base, engine
from models import Category, Restaurant

Base.metadata.create_all(bind=engine)
print("Tables created successfully ✅")