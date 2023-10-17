package jpa.query.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
}
