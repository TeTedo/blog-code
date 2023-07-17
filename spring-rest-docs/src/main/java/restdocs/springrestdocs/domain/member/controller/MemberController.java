package restdocs.springrestdocs.domain.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import restdocs.springrestdocs.domain.member.dto.response.MemberResponse;

@RestController
@RequestMapping("/members")
public class MemberController {

    @GetMapping
    public ResponseEntity<MemberResponse> getMemberList() {

        MemberResponse response = MemberResponse.builder()
                .build();

        return ResponseEntity.ok().body(response);
    }

}
