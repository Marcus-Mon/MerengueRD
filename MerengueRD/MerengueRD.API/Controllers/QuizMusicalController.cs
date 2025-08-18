using Microsoft.AspNetCore.Mvc;
using MerengueRD.Application.Services;
using MerengueRD.Domain.Entities;

namespace MerengueRD.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizMusicalController : ControllerBase
    {
        private readonly QuizMusicalService _quizService;

        public QuizMusicalController(QuizMusicalService quizService)
        {
            _quizService = quizService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuizMusical>>> GetAllQuizzes()
        {
            try
            {
                var quizzes = await _quizService.GetAllAsync();
                return Ok(quizzes);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QuizMusical>> GetQuiz(int id)
        {
            try
            {
                var quiz = await _quizService.GetByIdAsync(id);
                if (quiz == null)
                    return NotFound($"Quiz con ID {id} no encontrado");

                return Ok(quiz);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("by-level/{level}")]
        public async Task<ActionResult<IEnumerable<QuizMusical>>> GetQuizzesByLevel(string level)
        {
            try
            {
                var quizzes = await _quizService.GetQuizzesByLevelAsync(level);
                return Ok(quizzes);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("{id}/start")]
        public async Task<ActionResult<QuizSessionResponse>> StartQuiz(int id)
        {
            try
            {
                var quizSession = await _quizService.StartQuizAsync(id);
                if (quizSession == null)
                    return NotFound($"Quiz con ID {id} no encontrado");

                return Ok(quizSession);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPost("{id}/submit")]
        public async Task<ActionResult<QuizResultResponse>> SubmitQuiz(int id, [FromBody] QuizSubmissionRequest submission)
        {
            try
            {
                var result = await _quizService.EvaluateQuizAsync(id, submission.Answers);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<QuizMusical>> CreateQuiz([FromBody] QuizMusical quiz)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var createdQuiz = await _quizService.AddAsync(quiz);
                return CreatedAtAction(nameof(GetQuiz), new { id = createdQuiz.Id }, createdQuiz);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<QuizMusical>> UpdateQuiz(int id, [FromBody] QuizMusical quiz)
        {
            try
            {
                if (id != quiz.Id)
                    return BadRequest("El ID no coincide");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updatedQuiz = await _quizService.UpdateAsync(quiz);
                return Ok(updatedQuiz);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteQuiz(int id)
        {
            try
            {
                await _quizService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }
    }

    public class QuizSessionResponse
    {
        public int QuizId { get; set; }
        public string Titulo { get; set; }
        public string Nivel { get; set; }
        public string DuracionMax { get; set; }
        public List<QuestionQuiz> Preguntas { get; set; }
        public DateTime StartTime { get; set; }
    }

    public class QuizSubmissionRequest
    {
        public Dictionary<int, string> Answers { get; set; } // QuestionId -> UserAnswer
    }

    public class QuizResultResponse
    {
        public int QuizId { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public double Percentage { get; set; }
        public TimeSpan TimeTaken { get; set; }
        public List<QuestionResult> Results { get; set; }
    }

    public class QuestionResult
    {
        public int QuestionId { get; set; }
        public string Enunciado { get; set; }
        public string UserAnswer { get; set; }
        public string CorrectAnswer { get; set; }
        public bool IsCorrect { get; set; }
    }
}

        