from sqlalchemy.orm import Session
from models import Restaurant


def _get_ranked_in_category(db: Session, category_id: int):
    return (
        db.query(Restaurant)
        .filter(Restaurant.category_id == category_id)
        .order_by(Restaurant.rank.asc(), Restaurant.id.asc())
        .all()
    )


def increase_rank(db: Session, restaurant_id: int):
    r = db.get(Restaurant, restaurant_id)
    if r is None:
        return None

    ranked = _get_ranked_in_category(db, r.category_id)
    idx = next((i for i, item in enumerate(ranked) if item.id == r.id), -1)
    if idx <= 0:
        return r

    above = ranked[idx - 1]
    above.rank, r.rank = r.rank, above.rank
    db.commit()
    db.refresh(r)
    return r


def decrease_rank(db: Session, restaurant_id: int):
    r = db.get(Restaurant, restaurant_id)
    if r is None:
        return None

    ranked = _get_ranked_in_category(db, r.category_id)
    idx = next((i for i, item in enumerate(ranked) if item.id == r.id), -1)
    if idx == -1 or idx >= len(ranked) - 1:
        return r

    below = ranked[idx + 1]
    below.rank, r.rank = r.rank, below.rank
    db.commit()
    db.refresh(r)
    return r
