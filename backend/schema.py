from pydantic import BaseModel, Field

class CategoryBase(BaseModel):
    name: str 

class CategoryCreate(BaseModel):
    name: str

class CategoryDelete(BaseModel):
    id: int

class CategoryRead(CategoryBase):
    id: int

    class Config:
        orm_mode = True

class RestaurantBase(BaseModel):
    name: str 
    rank: int 
    category_id: int 

class RestaurantCreate(BaseModel):
    name: str
    category_id: int

class RestaurantDelete(BaseModel):
    id: int

class RestaurantRead(RestaurantBase):
    id: int

    class Config:
        orm_mode = True