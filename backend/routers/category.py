from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Category, Restaurant
from schema import CategoryCreate, CategoryRead
from db import get_db

router = APIRouter(
    prefix="/categories",
    tags=["categories"]
)

@router.post("/", response_model=CategoryRead)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/{category_id}", response_model=CategoryRead)
def get_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.get("/", response_model=list[CategoryRead])
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories

@router.delete("/{category_id}", response_model=CategoryRead)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.query(Restaurant).filter(Restaurant.category_id == category_id).delete(synchronize_session=False)
    db.delete(db_category)
    db.commit()
    return db_category
