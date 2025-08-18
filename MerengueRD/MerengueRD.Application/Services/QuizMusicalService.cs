using MerengueRD.Application.DTOs;
using MerengueRD.Domain.Entities;
using MerengueRD.Infrastructure.Interfaces;

namespace MerengueRD.Application.Services
{
    public class QuizMusicalService
    {
        private readonly IQuizMusicalRepository _repository;
        public QuizMusicalService(IQuizMusicalRepository repository)
        {
            _repository = repository;
        }
        public async Task<QuizMusicalDto?> GetByIdAsync(int id)
        {
            var QuizMusical = await _repository.GetByIdAsync(id);
            if (QuizMusical == null) return null;

            return new QuizMusicalDto
            {
                Id = QuizMusical.Id,
                Titulo = QuizMusical.Titulo,
                DuracionMax = QuizMusical.DuracionMax,
                Nivel = QuizMusical.Nivel,
                Preguntas = QuizMusical.Preguntas
                .Select(p => new QuestionQuizDto
                 {
                     Id = p.Id,
                     Enunciado = p.Enunciado,
                     Tipo = p.Tipo,
                     Opciones = p.Opciones,
                     RespuestaCorrecta = p.RespuestaCorrecta
                 }).ToList()
            };
        }
        public async Task<IEnumerable<QuizMusicalDto>> GetAllAsync()
        {
            var quizmusicals = await _repository.GetAllAsync();
            return quizmusicals.Select(qm => new QuizMusicalDto
            {
                Id = qm.Id,
                Titulo = qm.Titulo,
                DuracionMax = qm.DuracionMax,
                Nivel = qm.Nivel,
                Preguntas = qm.Preguntas
                .Select(p => new QuestionQuizDto
                {
                    Id = p.Id,
                    Enunciado = p.Enunciado,
                    Tipo = p.Tipo,
                    Opciones = p.Opciones,
                    RespuestaCorrecta = p.RespuestaCorrecta
                }).ToList()
            });
        }
        public async Task AddAsync(QuizMusicalDto dto)
        {
            var quizmusical = new QuizMusical
            {
                Titulo = dto.Titulo,
                DuracionMax = dto.DuracionMax,
                Nivel = dto.Nivel,
                Preguntas = dto.Preguntas.Select(p => new QuestionQuiz
                {
                    Enunciado = p.Enunciado,
                    Tipo = p.Tipo,
                    Opciones = p.Opciones,
                    RespuestaCorrecta = p.RespuestaCorrecta
                }).ToList()
            };

            await _repository.AddAsync(quizmusical);

            dto.Id = quizmusical.Id;
        }

        public async Task UpdateAsync(QuizMusicalDto dto)
        {
            var quizmusicals = new QuizMusical
            {
                Id = dto.Id,
                Titulo = dto.Titulo,
                DuracionMax = dto.DuracionMax,
                Nivel = dto.Nivel,
                Preguntas = dto.Preguntas
                .Select(p => new QuestionQuiz
                {
                    Id = p.Id,
                    Enunciado = p.Enunciado,
                    Tipo = p.Tipo,
                    Opciones = p.Opciones,
                    RespuestaCorrecta = p.RespuestaCorrecta
                }).ToList()
            };
            await _repository.UpdateAsync(quizmusicals);
        }
        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

    }
}
