from sqlalchemy import Column, Integer, String, ForeignKey
from db import Base

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)

class Restaurant(Base):
    __tablename__ = "restaurants"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    rank = Column(Integer, default=0)
    category_id = Column(Integer, ForeignKey("categories.id"))