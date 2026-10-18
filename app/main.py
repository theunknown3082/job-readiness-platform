from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.core.middleware import RequestContextMiddleware
from app.routers import auth, problems, progress, readiness

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Job Readiness & Skill Tracking Platform",
    description="Backend microservice tracking technical preparation metrics and candidate readiness.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)

app.add_middleware(RequestContextMiddleware)

app.include_router(auth.router)
app.include_router(problems.router)
app.include_router(progress.router)
app.include_router(readiness.router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
