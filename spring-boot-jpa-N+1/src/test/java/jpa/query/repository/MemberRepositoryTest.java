package jpa.query.repository;

import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    @Test
    public void 멤버_조회_EntityGraph() {
        List<Member> members = memberRepository.findAllByEntityGraph();

        for (Member member : members) {
            System.out.println(member.getTeam());
        }
    }

    @Test
    public void 멤버_조회_FETCH_JOIN_Paging() {

        int pageNumber = 0;
        int pageSize = 5;
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

        Page<Member> members = memberRepository.findAllByFetchJoinWithPaging(pageRequest);

        for (Member member : members) {
            System.out.println(member.getTeam());
        }

        Assertions.assertThat(members.getSize()).isEqualTo(pageSize);
        Assertions.assertThat(members.getContent())
                .extracting("username")
                .containsExactly("username0", "username1", "username2", "username3", "username4");
    }

    @Test
    public void 팀_조회_FETCH_JOIN() {
        List<Team> teams = teamRepository.findAllByFetchJoin();

        for (Team team : teams) {
            System.out.println("team : " + team);

            for (Member member : team.getMembers()) {
                System.out.println("member : " + member);
            }
        }
    }

}
