package jpa.query.repository;

import java.util.List;

import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jpa.query.domain.Member;
import jpa.query.domain.Team;

@SpringBootTest
@Transactional(readOnly = true)
public class MemberRepositoryTest {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    EntityManager em;

    @BeforeEach
    public void setUp() {
        for (int i = 0; i < 100; i++) {
            Team team = Team.builder()
                    .name("teamName" + i)
                    .build();

            teamRepository.save(team);

            Member member = Member.builder()
                    .username("username" + i)
                    .team(team)
                    .build();

            memberRepository.save(member);
        }

        em.flush();
        em.clear();
    }

    @Test
    public void 멤버_조회() {
        List<Member> members = memberRepository.findAll();

        for (Member member : members) {
            System.out.println(member.getTeam());
        }
    }

    @Test
    public void 멤버_조회_FETCH_JOIN() {
        List<Member> members = memberRepository.findAllByFetchJoin();

        for (Member member : members) {
            System.out.println(member.getTeam());
        }
    }

    @Test
    public void 멤버_조회_JOIN() {
        List<Member> members = memberRepository.findAllByJoin();

        for (Member member : members) {
            System.out.println(member.getTeam());
        }
    }
}
