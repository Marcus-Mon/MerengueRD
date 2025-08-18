using MerengueRD.Application.DTOs;
using MerengueRD.Domain.Entities;
using MerengueRD.Infrastructure.Interfaces;

namespace MerengueRD.Application.Services
{
    public class QuestionQuizService
    {
        private readonly IQuestionQuizRepository _repository;
        public QuestionQuizService(IQuestionQuizRepository repository)
        {
            _repository = repository;
        }
        public async Task<QuestionQuizDto?> GetByIdAsync(int id)
        {
            var QuestionQuiz = await _repository.GetByIdAsync(id);
            if (QuestionQuiz == null) return null;

            return new QuestionQuizDto
            {
                Id = QuestionQuiz.Id,
                Enunciado = QuestionQuiz.Enunciado,
                Tipo = QuestionQuiz.Tipo,
                Opciones = QuestionQuiz.Opciones,
                RespuestaCorrecta = QuestionQuiz.RespuestaCorrecta,

            };


        }
        public async Task<IEnumerable<QuestionQuizDto>> GetAllAsync()
        {
            var questionquizzes = await _repository.GetAllAsync();
            return questionquizzes.Select(q => new QuestionQuizDto
            {
                Id = q.Id,
                Enunciado = q.Enunciado,
                Tipo = q.Tipo,
                Opciones = q.Opciones,
                RespuestaCorrecta = q.RespuestaCorrecta,
            });
        }
        public async Task AddAsync(QuestionQuizDto dto)
        {
            var questionquiz = new QuestionQuiz
            {
                Enunciado = dto.Enunciado,
                Tipo = dto.Tipo,
                Opciones = dto.Opciones,
                RespuestaCorrecta = dto.RespuestaCorrecta,
            };
            await _repository.AddAsync(questionquiz);
        }
        public async Task UpdateAsync(QuestionQuizDto dto)
        {
            var questionquiz = new QuestionQuiz
            {
                Id = dto.Id,
                Enunciado = dto.Enunciado,
                Tipo = dto.Tipo,
                Opciones = dto.Opciones,
                RespuestaCorrecta = dto.RespuestaCorrecta,
            };
            await _repository.UpdateAsync(questionquiz);
        }
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
