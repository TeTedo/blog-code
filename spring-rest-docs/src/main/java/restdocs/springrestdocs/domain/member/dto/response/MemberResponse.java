package restdocs.springrestdocs.domain.member.dto.response;

import lombok.Builder;

@Builder
public record MemberResponse(
        Long id,
        String name,
        String email) {

}
