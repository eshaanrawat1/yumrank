from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Category, Restaurant
from schema import RestaurantCreate, RestaurantRead, RestaurantDelete
from db import get_db
from services.restaurant import increase_rank, decrease_rank

router = APIRouter(
    prefix="/restaurants",
    tags=["restaurants"]
)


@router.post("/", response_model=RestaurantRead)
def create_restaurant(restaurant: RestaurantCreate, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == restaurant.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    max_rank = (
        db.query(Restaurant)
        .filter(Restaurant.category_id == restaurant.category_id)
        .order_by(Restaurant.rank.desc())
        .first()
    )
    rank = (max_rank.rank + 1) if max_rank else 1

    db_restaurant = Restaurant(
        name=restaurant.name,
        category_id=restaurant.category_id,
        rank=rank
    )
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant


@router.get("/", response_model=list[RestaurantRead])
def list_restaurants(category_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(Restaurant)
    if category_id is not None:
        query = query.filter(Restaurant.category_id == category_id)
    return query.order_by(Restaurant.category_id.asc(), Restaurant.rank.asc(), Restaurant.id.asc()).all()


@router.get("/{restaurant_id}", response_model=RestaurantRead)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    db_restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not db_restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return db_restaurant


@router.delete("/{restaurant_id}", response_model=RestaurantDelete)
def delete_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    db_restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not db_restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    category_id = db_restaurant.category_id
    db.delete(db_restaurant)
    db.commit()

    remaining = (
        db.query(Restaurant)
        .filter(Restaurant.category_id == category_id)
        .order_by(Restaurant.rank.asc(), Restaurant.id.asc())
        .all()
    )
    for idx, restaurant in enumerate(remaining, start=1):
        restaurant.rank = idx
    db.commit()

    return {"id": restaurant_id}


@router.post("/{restaurant_id}/move_up", response_model=RestaurantRead)
def move_up_endpoint(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = increase_rank(db, restaurant_id)
    if not restaurant:
        raise HTTPException(404, "Restaurant not found")
    return restaurant


@router.post("/{restaurant_id}/move_down", response_model=RestaurantRead)
def move_down_endpoint(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = decrease_rank(db, restaurant_id)
    if not restaurant:
        raise HTTPException(404, "Restaurant not found")
    return restaurant
