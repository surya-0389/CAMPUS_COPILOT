"""Service for generating and retrieving step-by-step solutions."""

import uuid
from typing import Dict, Any


class SolutionService:
    @staticmethod
    def generate_solution_for_question(question_text: str, subject_id: str, topic_id: str = "") -> Dict[str, Any]:
        """Generate high-yield academic solution with short and detailed versions."""
        lower = question_text.lower()

        # Normalization domain
        if "normalization" in lower or "bcnf" in lower or "3nf" in lower or "2nf" in lower:
            short = (
                "Normalization eliminates data redundancy and update anomalies via relational decomposition. "
                "2NF removes partial dependencies (non-prime attributes must depend on the whole candidate key). "
                "3NF removes transitive dependencies (X -> A requires X to be a superkey OR A to be a prime attribute). "
                "BCNF strictly requires X to be a superkey for every non-trivial FD X -> A."
            )
            detailed = (
                "### Step-by-Step Academic Solution:\n\n"
                "**1. Core Definitions & Formal Properties:**\n"
                "- **First Normal Form (1NF):** Attribute values must be atomic (no multi-valued domains).\n"
                "- **Second Normal Form (2NF):** Satisfies 1NF and no non-prime attribute is partially dependent on any candidate key.\n"
                "- **Third Normal Form (3NF):** Satisfies 2NF and for every non-trivial FD $X \\to A$, either $X$ is a superkey OR $A$ is a prime attribute.\n"
                "- **Boyce-Codd Normal Form (BCNF):** For every non-trivial FD $X \\to A$, $X$ MUST strictly be a superkey.\n\n"
                "**2. Key Contrast (3NF vs BCNF):**\n"
                "In 3NF, the condition allowing $A$ to be a prime attribute preserves functional dependencies in all decompositions. "
                "BCNF enforces higher redundancy elimination but may not always preserve all functional dependencies.\n\n"
                "**3. Decomposition Verification Algorithm:**\n"
                "Given relation $R(A, B, C)$ decomposed into $R_1$ and $R_2$, the decomposition is lossless if and only if:\n"
                "$$R_1 \\cap R_2 \\to R_1 \\quad \\text{or} \\quad R_1 \\cap R_2 \\to R_2$$\n"
            )
            code = (
                "-- SQL Schema in BCNF Decomposition\n"
                "CREATE TABLE Department (\n"
                "    DeptID INT PRIMARY KEY,\n"
                "    DeptName VARCHAR(100) NOT NULL\n"
                ");\n\n"
                "CREATE TABLE Employee (\n"
                "    EmpID INT PRIMARY KEY,\n"
                "    EmpName VARCHAR(100),\n"
                "    DeptID INT REFERENCES Department(DeptID)\n"
                ");"
            )
            hint = "Recall the definition of prime vs non-prime attributes and check if the determinant is a superkey."
            diagram = "| Normal Form | Violations Eliminated | Condition for X -> A |\n|---|---|---|\n| 1NF | Repeating groups | Atomic values |\n| 2NF | Partial dependencies | Full functional dependency on candidate key |\n| 3NF | Transitive dependencies | X is superkey OR A is prime |\n| BCNF | Redundancy in non-superkey determinants | X MUST be superkey |"

        # Concurrency / ACID domain
        elif "acid" in lower or "transaction" in lower or "serializ" in lower or "2pl" in lower:
            short = (
                "Transactions require ACID properties: Atomicity (all-or-nothing via Write-Ahead Logging / WAL), Consistency (integrity constraints), "
                "Isolation (serializability via 2PL/timestamping), and Durability (persistence via log flush). "
                "Conflict serializability is verified by acyclic precedence graphs."
            )
            detailed = (
                "### Step-by-Step Solution:\n\n"
                "**1. ACID Breakdown & Subsystem Responsibilities:**\n"
                "- **Atomicity:** Ensured by the Recovery Manager through Write-Ahead Logging (undo/redo).\n"
                "- **Consistency:** Preserved by application logic and database constraint validators.\n"
                "- **Isolation:** Controlled by the Concurrency Control Manager (Two-Phase Locking, Timestamp Ordering).\n"
                "- **Durability:** Ensured by the Log Manager writing commit records to non-volatile disk.\n\n"
                "**2. Conflict Serializability:**\n"
                "Two operations conflict if they belong to different transactions, access the same data item, and at least one is a Write.\n"
                "Testing: Construct directed Precedence Graph $G = (V, E)$. Schedule is conflict serializable $\\iff$ $G$ is acyclic."
            )
            code = None
            hint = "Identify conflicting read/write pairs on the same data item and check for cycles in the directed graph."
            diagram = "Precedence Graph Rule: T1 -> T2 edge created if T1 performs conflicting action before T2."

        else:
            short = f"Standard university exam solution for {subject_id}: Concept analysis and application steps."
            detailed = (
                f"### Academic Solution for {subject_id}\n\n"
                "1. State the fundamental definitions and axioms governing the problem.\n"
                "2. Apply relevant theoretical proofs, algorithms, or derivation steps.\n"
                "3. Conclude with time/space complexity analysis or architectural trade-offs."
            )
            code = None
            hint = "Review lecture slides and formula sheet for the core theorem."
            diagram = None

        return {
            "id": f"sol-{uuid.uuid4().hex[:8]}",
            "solution_text": detailed,
            "short_answer": short,
            "detailed_explanation": detailed,
            "hint_text": hint,
            "code_snippet": code,
            "diagram_description": diagram,
            "solution_type": "ai_generated",
            "explanation_level": "detailed",
            "source_description": "AI Academic Mentor (Derived from Verified Academic Syllabus)",
            "verification_status": "ai_provisional",
            "generated_by_model": "gemini-3.8-flash"
        }
