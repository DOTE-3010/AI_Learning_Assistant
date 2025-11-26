from backend.app.database import engine, SessionLocal
from backend.models.postgres import Base, User, Course, Assignment
import datetime

def init_db():
    # Create tables
    # Note: drop_all was used for schema dev, commented out to allow persistence
    # Base.metadata.drop_all(bind=engine) 
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if seeded
    if db.query(User).filter(User.email == "teacher@cuhk.edu.hk").first():
        print("Data already seeded.")
        db.close()
        return

    # Seed User
    teacher = User(
        email="teacher@cuhk.edu.hk",
        role="teacher",
        course_ids=[1],
        # Simple demo hash logic: "hash_" + password
        password_hash="hash_Aa12345678", 
        created_at=datetime.datetime.utcnow()
    )
    db.add(teacher)
    
    # Seed Course
    course = Course(
        title="Quick Start Guide",
        term="MVP",
        teacher_email="teacher@cuhk.edu.hk"
    )
    db.add(course)
    db.commit() # Commit to get IDs
    
    # Seed Assignment
    assignment = Assignment(
        course_id=course.id,
        title="Tutorial: How to Use Solver#42",
        instructions="""**Welcome to Solver#42!**

This tutorial assignment helps you understand how to use the system.

**How to Generate:**
1. Click "Execute Generation" below to see a sample response.
2. Try adding specific instructions in the "Instruction Override Protocol" box (e.g., "Summarize in 3 bullet points").
3. Upload a text file to see how reference materials are handled.

**How to Create Content:**
- Use the "+ New Course" button at the top to create your own workspace.
- Use "+ Create Assignment" in the sidebar to add tasks.

*This is the MVP environment. All generated files are saved to your local 'workspace' folder.*""",
        due_at=datetime.datetime.utcnow() + datetime.timedelta(days=365),
        guidance_policy={"mask_code": True},
        output_formats=["md", "py", "ipynb", "pdf"]
    )
    db.add(assignment)
    
    db.commit()
    print("Database seeded successfully.")
    db.close()

if __name__ == "__main__":
    init_db()
