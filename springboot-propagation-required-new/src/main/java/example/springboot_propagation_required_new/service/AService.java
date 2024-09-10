package example.springboot_propagation_required_new.service;

import example.springboot_propagation_required_new.entity.A;
import example.springboot_propagation_required_new.repository.ARepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AService {
    private final ARepository aRepository;

    @Transactional
    public void main() {
        A a = aRepository.findById(1L)
                .orElseThrow(IllegalStateException::new);

        one(a);
        two(a);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void one(A a) {
        a.setState("state2");
    }

    @Transactional
    public void two(A a) {
        a.setState("state3");
    }
}
