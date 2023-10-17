package jpa.query.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import jpa.query.domain.Team;

public interface TeamRepository extends JpaRepository<Team, Long> {

}
