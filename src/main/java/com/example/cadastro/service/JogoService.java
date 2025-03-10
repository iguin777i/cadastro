package com.example.cadastro.service;

import com.example.cadastro.model.Jogo;
import com.example.cadastro.repository.JogoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class JogoService {
    private final JogoRepository jogoRepository;
    private final Logger logger = LoggerFactory.getLogger(JogoService.class);

    public JogoService(JogoRepository jogoRepository) {
        this.jogoRepository = jogoRepository;
    }

    public List<Jogo> listarJogos() {
        try {
            return jogoRepository.findAll();
        } catch (Exception e) {
            logger.error("Erro ao listar jogos: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Jogo criarJogo(Jogo jogo) {
        try {
            logger.info("Tentando criar jogo: {}", jogo);
            return jogoRepository.save(jogo);
        } catch (Exception e) {
            logger.error("Erro ao criar jogo: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Jogo atualizarJogo(Long id, Jogo jogo) {
        try {
            logger.info("Tentando atualizar jogo com ID {}: {}", id, jogo);
            jogo.setId(id);
            return jogoRepository.save(jogo);
        } catch (Exception e) {
            logger.error("Erro ao atualizar jogo: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void deletarJogo(Long id) {
        try {
            logger.info("Tentando deletar jogo com ID: {}", id);
            jogoRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("Erro ao deletar jogo: {}", e.getMessage(), e);
            throw e;
        }
    }
} 