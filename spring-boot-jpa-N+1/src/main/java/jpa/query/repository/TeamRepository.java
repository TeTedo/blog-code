package jpa.query.repository;

import java.util.List;

import org.hibernate.annotations.BatchSize;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import jpa.query.domain.Team;

public interface TeamRepository extends JpaRepository<Team, Long> {
        @Query("""
                        SELECT t
                        FROM Team t
                        JOIN FETCH t.members m
                        """)
        List<Team> findAllByFetchJoin();

        @Query("""
                        SELECT t
                        FROM Team t
                        JOIN FETCH t.members m
                        """)
        Page<Team> findAllByFetchJoinWithPaging(Pageable pageable);

}
