from __future__ import annotations

from pydantic import BaseModel, Field, ValidationError, field_validator

from backend.app.iterative_generation.contracts import PromptSections


class PromptSchemaModel(BaseModel):
    task_definition: str = Field(min_length=1)
    technical_description: str = Field(min_length=1)
    iteration_state: str = Field(min_length=1)
    quality_bar: str = Field(min_length=1)
    output_contract: str = Field(min_length=1)
    context_bundle: str = Field(min_length=1)

    @field_validator("*")
    @classmethod
    def reject_blank_strings(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("Prompt section cannot be empty.")
        return value


def validate_prompt_sections(sections: PromptSections) -> None:
    PromptSchemaModel(
        task_definition=sections.task_definition,
        technical_description=sections.technical_description,
        iteration_state=sections.iteration_state,
        quality_bar=sections.quality_bar,
        output_contract=sections.output_contract,
        context_bundle=sections.context_bundle,
    )


def get_validation_error_message(exc: ValidationError) -> str:
    return f"Prompt schema validation failed: {exc.errors()}"
