-- MySQL dump 10.13  Distrib 5.7.20, for Linux (x86_64)
--
-- Host: localhost    Database: jobz_portal_de_empregos
-- ------------------------------------------------------
-- Server version	5.7.20-0ubuntu0.17.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Admin`
--

DROP TABLE IF EXISTS `Admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Admin` (
  `idAdmin` int(11) NOT NULL AUTO_INCREMENT,
  `nome_de_utilizador` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idAdmin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin`
--

LOCK TABLES `Admin` WRITE;
/*!40000 ALTER TABLE `Admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `Admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Candidato`
--

DROP TABLE IF EXISTS `Candidato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Candidato` (
  `idCandidato` int(11) NOT NULL AUTO_INCREMENT,
  `primeiro_nome` varchar(45) DEFAULT NULL,
  `ultimo_nome` varchar(45) DEFAULT NULL,
  `data_de_nascimento` date DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(65) NOT NULL,
  `nacionalidade` varchar(45) DEFAULT NULL,
  `naturalidade` varchar(45) DEFAULT NULL,
  `data_de_registo` date DEFAULT NULL,
  `area_de_preferencia` varchar(45) DEFAULT NULL,
  `disposicao_de_realocacao` varchar(3) DEFAULT NULL,
  `foto_de_perfil` varchar(45) DEFAULT NULL,
  `currivulum_vitae` varchar(45) DEFAULT NULL,
  `anos_de_experiencia` int(11) DEFAULT NULL,
  `telefone` varchar(13) DEFAULT NULL,
  `telefone_alternativo` varchar(13) DEFAULT NULL,
  `genero` varchar(30) DEFAULT NULL,
  `morada` varchar(45) DEFAULT NULL,
  `codigo_de_confirmacao` int(11) DEFAULT NULL,
  `provincia_onde_reside` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idCandidato`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Candidato`
--

LOCK TABLES `Candidato` WRITE;
/*!40000 ALTER TABLE `Candidato` DISABLE KEYS */;
INSERT INTO `Candidato` VALUES (1,'João','Mandume','2017-12-08','firmino.changani@looplab.co.ao','123','Angola','Luanda','2017-12-02',NULL,NULL,NULL,NULL,NULL,'915044355','923','Masculino','Morro Bento, Rua da IMETRO',15166,'Luanda'),(2,'Firmino','Changani','2017-12-13','firmino.changani@gmail.com','123','Angola','Luanda','2017-12-03',NULL,NULL,NULL,NULL,NULL,'915044355','923','Masculino','Morro Bento, Rua da IMETRO',411255,'Luanda');
/*!40000 ALTER TABLE `Candidato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Candidatura`
--

DROP TABLE IF EXISTS `Candidatura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Candidatura` (
  `idCandidato` int(11) NOT NULL AUTO_INCREMENT,
  `idVaga` int(11) NOT NULL,
  `idEmpregador` int(11) NOT NULL,
  `data_da_candidatura` date DEFAULT NULL,
  PRIMARY KEY (`idCandidato`,`idVaga`,`idEmpregador`),
  KEY `fk_Candidato_has_Vaga_Vaga1_idx` (`idVaga`,`idEmpregador`),
  KEY `fk_Candidato_has_Vaga_Candidato1_idx` (`idCandidato`),
  CONSTRAINT `fk_Candidato_has_Vaga_Candidato1` FOREIGN KEY (`idCandidato`) REFERENCES `Candidato` (`idCandidato`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Candidato_has_Vaga_Vaga1` FOREIGN KEY (`idVaga`, `idEmpregador`) REFERENCES `Vaga` (`idVaga`, `Empregador_idEmpregador`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Candidatura`
--

LOCK TABLES `Candidatura` WRITE;
/*!40000 ALTER TABLE `Candidatura` DISABLE KEYS */;
/*!40000 ALTER TABLE `Candidatura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Empregador`
--

DROP TABLE IF EXISTS `Empregador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Empregador` (
  `idEmpregador` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `area_de_actuacao` varchar(45) DEFAULT NULL,
  `ano_de_fundacao` int(11) DEFAULT NULL,
  `numero_de_funcionarios` varchar(45) DEFAULT NULL,
  `biografia` varchar(1000) DEFAULT NULL,
  `nome_do_responsavel` varchar(45) DEFAULT NULL,
  `email_do_responsavel` varchar(45) NOT NULL,
  `password` varchar(65) NOT NULL,
  `data_de_cadastro` date DEFAULT NULL,
  `ultimo_login` date DEFAULT NULL,
  `logotipo` varchar(45) DEFAULT NULL,
  `codigo_de_confirmacao` int(11) DEFAULT NULL,
  `contacto` varchar(13) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idEmpregador`),
  UNIQUE KEY `email_do_responsavel_UNIQUE` (`email_do_responsavel`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Empregador`
--

LOCK TABLES `Empregador` WRITE;
/*!40000 ALTER TABLE `Empregador` DISABLE KEYS */;
INSERT INTO `Empregador` VALUES (1,'JOTA','Tecnológias de Informação',2017,NULL,NULL,'Firmino Changani','firmino.changani@looplab.co.ao','123',NULL,NULL,NULL,NULL,NULL,NULL),(2,'KiandaHUB','Tecnológias de Informação',2017,'3','adasda','Joel Epalanga','joel.epalanga@gmail.com','123',NULL,NULL,NULL,NULL,'915','geral@kiandahub.com'),(3,'LoopLab Web, Lda','Tecnológias de Informação',2017,'2','asdasd','Firmino Changani','comercial@looplab.co.ao','$2a$10$LWBjlpVBQW49Laijs96JL.htq.GvJagHER0WanfZtnITvX8cj65uy',NULL,NULL,NULL,NULL,'915044355','comercial@looplab.co.ao');
/*!40000 ALTER TABLE `Empregador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ExperienciaProfissional`
--

DROP TABLE IF EXISTS `ExperienciaProfissional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ExperienciaProfissional` (
  `Candidato_idCandidato` int(11) NOT NULL AUTO_INCREMENT,
  `nome_da_empresa` varchar(45) DEFAULT NULL,
  `funcao` varchar(45) DEFAULT NULL,
  `data_de_inicio` date DEFAULT NULL,
  `data_de_termino` date DEFAULT NULL,
  `Profissional_idProfissional` int(11) NOT NULL,
  PRIMARY KEY (`Candidato_idCandidato`,`Profissional_idProfissional`),
  KEY `fk_ExperienciaProfissional_Profissional1_idx` (`Profissional_idProfissional`),
  CONSTRAINT `fk_ExperienciaProfissional_Profissional1` FOREIGN KEY (`Profissional_idProfissional`) REFERENCES `Candidato` (`idCandidato`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ExperienciaProfissional`
--

LOCK TABLES `ExperienciaProfissional` WRITE;
/*!40000 ALTER TABLE `ExperienciaProfissional` DISABLE KEYS */;
/*!40000 ALTER TABLE `ExperienciaProfissional` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FormacaoAcademica`
--

DROP TABLE IF EXISTS `FormacaoAcademica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FormacaoAcademica` (
  `idFormacaoAcademica` int(11) NOT NULL AUTO_INCREMENT,
  `nome_da_instituicao` varchar(45) DEFAULT NULL,
  `titulo_obtido` varchar(45) DEFAULT NULL,
  `ano_de_inicio` int(11) DEFAULT NULL,
  `ano_de_termino` int(11) DEFAULT NULL,
  `Candidato_idCandidato` int(11) NOT NULL,
  PRIMARY KEY (`idFormacaoAcademica`,`Candidato_idCandidato`),
  KEY `fk_FormacaoAcademica_Profissional_idx` (`Candidato_idCandidato`),
  CONSTRAINT `fk_FormacaoAcademica_Profissional` FOREIGN KEY (`Candidato_idCandidato`) REFERENCES `Candidato` (`idCandidato`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FormacaoAcademica`
--

LOCK TABLES `FormacaoAcademica` WRITE;
/*!40000 ALTER TABLE `FormacaoAcademica` DISABLE KEYS */;
/*!40000 ALTER TABLE `FormacaoAcademica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Idiomas`
--

DROP TABLE IF EXISTS `Idiomas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Idiomas` (
  `idIdiomas` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  `fluencia` varchar(45) DEFAULT NULL,
  `Candidato_idCandidato` int(11) NOT NULL,
  PRIMARY KEY (`idIdiomas`,`Candidato_idCandidato`),
  KEY `fk_Idiomas_Candidato1_idx` (`Candidato_idCandidato`),
  CONSTRAINT `fk_Idiomas_Candidato1` FOREIGN KEY (`Candidato_idCandidato`) REFERENCES `Candidato` (`idCandidato`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Idiomas`
--

LOCK TABLES `Idiomas` WRITE;
/*!40000 ALTER TABLE `Idiomas` DISABLE KEYS */;
/*!40000 ALTER TABLE `Idiomas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LinksPessoais`
--

DROP TABLE IF EXISTS `LinksPessoais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LinksPessoais` (
  `idLinksPessoais` int(11) NOT NULL AUTO_INCREMENT,
  `nome_do_servico` varchar(45) DEFAULT NULL,
  `link_do_servico` varchar(45) DEFAULT NULL,
  `idCandidato` int(11) NOT NULL,
  `idEmpregador` int(11) NOT NULL,
  PRIMARY KEY (`idLinksPessoais`,`idCandidato`,`idEmpregador`),
  KEY `fk_LinksPessoais_Profissional1_idx` (`idCandidato`),
  KEY `fk_LinksPessoais_Empregador1_idx` (`idEmpregador`),
  CONSTRAINT `fk_LinksPessoais_Empregador1` FOREIGN KEY (`idEmpregador`) REFERENCES `Empregador` (`idEmpregador`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_LinksPessoais_Profissional1` FOREIGN KEY (`idCandidato`) REFERENCES `Candidato` (`idCandidato`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LinksPessoais`
--

LOCK TABLES `LinksPessoais` WRITE;
/*!40000 ALTER TABLE `LinksPessoais` DISABLE KEYS */;
/*!40000 ALTER TABLE `LinksPessoais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Vaga`
--

DROP TABLE IF EXISTS `Vaga`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Vaga` (
  `idVaga` int(11) NOT NULL AUTO_INCREMENT,
  `cargo` varchar(45) NOT NULL,
  `descricao` varchar(1000) NOT NULL,
  `data_de_publicacao` date DEFAULT NULL,
  `Empregador_idEmpregador` int(11) NOT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `tipo_de_contrato` varchar(45) DEFAULT NULL,
  `anos_de_experiencia` int(11) NOT NULL,
  `provincia` varchar(45) NOT NULL,
  `area_de_actuacao` varchar(45) DEFAULT NULL,
  `habilidades_necessarias` varchar(1000) DEFAULT NULL,
  `salario` float DEFAULT NULL,
  `idiomas` varchar(45) DEFAULT NULL,
  `quantidade_de_vagas` int(11) DEFAULT NULL,
  `data_limite` date DEFAULT NULL,
  `nivel_academico` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idVaga`,`Empregador_idEmpregador`),
  KEY `fk_Vaga_Empregador1_idx` (`Empregador_idEmpregador`),
  CONSTRAINT `fk_Vaga_Empregador1` FOREIGN KEY (`Empregador_idEmpregador`) REFERENCES `Empregador` (`idEmpregador`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Vaga`
--

LOCK TABLES `Vaga` WRITE;
/*!40000 ALTER TABLE `Vaga` DISABLE KEYS */;
INSERT INTO `Vaga` VALUES (6,'Supervisor de TI','Supervisor de IT com experiência mínima de 5 anos.','2017-12-22',2,'Activo','Tempo indeterminado',5,'Benguela','Tecnológias de Informação','Licenciatura em IT\r\nExperiência em liderança de pelo menos 5 anos;\r\nExperiência em negociação com fornecedores;\r\nIdade mínima 30 anos;Inglês fluente.',320000,'pt',3,'2017-12-24',NULL),(7,'Analista de TI','O Analista de Suporte em Redes e TI será o profissional responsável por\r\nprojetar, planejar, instalar, configurar e administrar redes comunicação,\r\ncomputadores e periféricos ao serviço de um projeto que abrangerá todas as\r\nprovíncias de Angola.\r\nEstará sob a responsabilidade do Analista de Suporte em Redes e TI\r\ncoordenar projetos e oferece soluções para ambientes informatizados, prestar\r\nsuporte técnico e treinamento ao usuário, estabelecer padrões, elaborar\r\ndocumentação técnica, pesquisar tecnologia em informática, orientar áreas de\r\napoio, acionar suporte de terceiros, instalar e configurar software e hardware,\r\ndimensionar requisitos e funcionalidade de sistemas, definir alternativas físicas\r\nde implementação, testar sistemas, monitorar o desempenho do sistema,\r\nidentificar falhas no sistema, executar procedimentos para melhoria de\r\ndesempenho de sistema, elaborar manuais do sistema e relatórios técnicos,\r\ndocumentar estrutura de rede.','2017-12-24',2,'Activo','Tempo determinado',2,'Bengo','Tecnológias de Informação',' Nacionalidade Angolana;\r\n Ensino Superior concluído na área de Tecnologia da Informação;\r\n Valoriza-se experiência em função similar mínimo de 03 anos;\r\n Conhecimentos em pacote Office intermediário;\r\n Manutenção de Hardware, substituição de fonte, memória, HD e\r\nprocessador;\r\n Conhecimento das tecnologias de localização GPS e rastreabilidade de\r\nveículos / bens;\r\n Suporte Técnico ao usuário (atendimento por telefone/e-mail) e remoto;\r\n Preferência: Residentes na zona de Viana ou próximo;',200000,'pt',2,'2018-01-06',NULL),(8,'Desenvolvedor Web','asdsad sdasdasd ','2017-12-25',2,'Activo','Estágio',1,'Bengo','Tecnológias de Informação','dasda asdasdasd',3,'P',2,'2018-01-01','Ensino de base'),(9,'Gestor de Marketing','asdad ','2017-12-25',2,'Activo','Tempo indeterminado',7,'Lunda Norte','Comunicação e Marketing','asdadas',590000,'Português, Inglês',3,'2018-01-02','Licenciado');
/*!40000 ALTER TABLE `Vaga` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-12-28 10:57:00
