from fastapi import FastAPI
from pydantic import BaseModel
from MLrecommendation import recommend_by_text

app = FastAPI()

# ✅ ADD THIS (so browser works)
@app.get("/")
def home():
    return {"message": "ML API Running 🚀"}

class Query(BaseModel):
    query: str

@app.post("/ml")
def get_recommendation(data: Query):
    results = recommend_by_text(data.query)
    return results.to_dict(orient="records")