package example.springboot_propagation_required_new.service;

import example.springboot_propagation_required_new.entity.A;
import example.springboot_propagation_required_new.repository.ARepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BService {

    private final ARepository aRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void one(A a) {
        a.setState("state2");
    }

    @Transactional
    public void two(A a) {
        a.setState("state3");
    }
}
