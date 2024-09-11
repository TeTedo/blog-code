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
    private final BService bService;

    @Transactional
    public void main() {
        A a = one();
        two(a);
    }

    @Transactional
    public void main2() {
        A a = bService.one();
        bService.two(a);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public A one() {
        A a = aRepository.findById(1L)
                .orElseThrow(IllegalStateException::new);

        a.setState("state2");
        return a;
    }

    @Transactional
    public void two(A a) {
        a.setState("state3");
    }
}
