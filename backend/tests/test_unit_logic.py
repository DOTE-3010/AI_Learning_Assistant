from unittest.mock import patch, MagicMock
from backend.app.standard_answer_generator import generate_answer_logic

class TestStandardAnswerGenerator:
    """
    Unit tests for the answer generator logic.
    Focus: Logic verification, Prompt construction, Error handling.
    """

    @patch("backend.app.standard_answer_generator.client.chat.completions.create")
    @patch("backend.app.standard_answer_generator.perform_web_search")
    def test_generate_answer_success_mock(self, mock_search, mock_openai):
        """
        Scenario: Successfully generate an answer using mocked OpenAI and Search.
        Expected: The function returns the mocked content and uses the correct prompt.
        """
        # 1. Mock External Dependencies
        mock_search.return_value = [{"title": "Calculus Info", "body": "Derivative of x^2 is 2x"}]
        
        mock_response = MagicMock()
        mock_response.choices[0].message.content = "The derivative is 2x."
        mock_openai.return_value = mock_response

        # 2. Execute Logic
        assignment_title = "Calculus 101"
        instructions = "Find derivative of x^2"
        result = generate_answer_logic(assignment_title, instructions, use_search=True)

        # 3. Assertions
        assert result == "The derivative is 2x."

        # Verify Prompt Construction
        call_args = mock_openai.call_args
        messages = call_args[1]['messages']
        user_prompt = messages[1]['content']
        
        assert "Calculus 101" in user_prompt
        assert "Derivative of x^2 is 2x" in user_prompt

    @patch("backend.app.standard_answer_generator.client.chat.completions.create")
    def test_generate_answer_openai_failure(self, mock_openai):
        """
        Scenario: OpenAI API fails (e.g., rate limit or network error).
        Expected: The function should gracefully handle the exception and return an error message.
        """
        # 1. Mock Exception
        mock_openai.side_effect = Exception("OpenAI API Unavailable")

        # 2. Execute Logic
        result = generate_answer_logic("Title", "Instructions", use_search=False)

        # 3. Assertions
        assert "Error generating answer" in result
        assert "OpenAI API Unavailable" in result

    def test_format_conversion(self):
        """
        Scenario: Test the format conversion logic.
        """
        from backend.app.standard_answer_generator import convert_to_format
        assert convert_to_format("content", "md") == "content"

