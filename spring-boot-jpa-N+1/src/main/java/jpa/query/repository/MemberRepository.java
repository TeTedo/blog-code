package jpa.query.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;

import jpa.query.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
    @Query("""
            SELECT m
            FROM Member m
            JOIN FETCH m.team t
            """)
    List<Member> findAllByFetchJoin();

    @Query("""
            SELECT m
            FROM Member m
            Join m.team
            """)
    List<Member> findAllByJoin();

    @Query("""
            SELECT m
            FROM Member m
            """)
    @EntityGraph(attributePaths = { "team" }, type = EntityGraphType.LOAD)
    List<Member> findAllByEntityGraph();

    @Query("""
            SELECT m
            FROM Member m
            JOIN FETCH m.team t
            """)
    Page<Member> findAllByFetchJoinWithPaging(Pageable pageable);
}
