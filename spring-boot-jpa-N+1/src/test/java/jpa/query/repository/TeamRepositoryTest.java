package jpa.query.repository;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jpa.query.domain.Member;
import jpa.query.domain.Team;

@SpringBootTest
@Transactional(readOnly = true)
public class TeamRepositoryTest {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    EntityManager em;

    @BeforeEach
    public void setUp() {
        Team teamA = Team.builder()
                .name("teamA")
                .build();

        Team teamB = Team.builder()
                .name("teamB")
                .build();

        teamRepository.save(teamA);
        teamRepository.save(teamB);

        for (int i = 0; i < 100; i++) {

            Member member = Member.builder()
                    .username("username" + i)
                    .team(i % 2 == 0 ? teamA : teamB)
                    .build();

            memberRepository.save(member);
        }

        em.flush();
        em.clear();
    }

    @Test
    public void 팀_조회() {
        List<Team> teams = teamRepository.findAll();

        for (Team team : teams) {
            System.out.println("team : " + team);

            for (Member member : team.getMembers()) {
                System.out.println("member : " + member);
            }
        }
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

    @Test
    public void 팀_조회_FETCH_JOIN_Paging() {
        int pageNumber = 0;
        int pageSize = 2;
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

        Page<Team> teams = teamRepository.findAllByFetchJoinWithPaging(pageRequest);

        for (Team team : teams) {
            System.out.println("team : " + team);

            for (Member member : team.getMembers()) {
                System.out.println("member : " + member);
            }
        }
    }

    @Test
    public void 팀_조회_BatchSize() {
        int pageNumber = 0;
        int pageSize = 3;
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);

        Page<Team> teams = teamRepository.findAll(pageRequest);

        for (Team team : teams) {
            System.out.println("team : " + team);

            for (Member member : team.getMembers()) {
                System.out.println("member : " + member);
            }
        }
    }
}
