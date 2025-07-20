# TCP vs UDP의 차이점과 사용 사례

## 목차

1. [개요](#개요)
2. [TCP (Transmission Control Protocol)](#tcp-transmission-control-protocol)
3. [UDP (User Datagram Protocol)](#udp-user-datagram-protocol)
4. [TCP vs UDP 비교](#tcp-vs-udp-비교)
5. [실제 사용 사례](#실제-사용-사례)
6. [정리](#정리)

## 개요

네트워크 통신에서 데이터를 전송하는 방법은 크게 두 가지로 나뉩니다: **TCP(Transmission Control Protocol)** 와 **UDP(User Datagram Protocol)** 입니다.

이 두 프로토콜은 각각 다른 특성을 가지고 있어서, 용도에 따라 적절한 프로토콜을 선택하는 것이 중요합니다.

## TCP (Transmission Control Protocol)

### 특징

- **연결 지향적 (Connection-oriented)**: 통신 전에 연결을 먼저 설정
- **신뢰성 보장**: 데이터 손실, 중복, 순서 보장
- **흐름 제어**: 수신 측의 처리 능력에 맞춰 데이터 전송 속도 조절
- **혼잡 제어**: 네트워크 상황에 따라 전송 속도 조절

### 동작 과정

```
1. 3-way handshake (연결 설정)
   Client → SYN → Server
   Client ← SYN + ACK ← Server
   Client → ACK → Server

2. 데이터 전송
   Client ↔ 데이터 ↔ Server

3. 4-way handshake (연결 해제)
   Client → FIN → Server
   Client ← ACK ← Server
   Client ← FIN ← Server
   Client → ACK → Server
```

### 장점

- 데이터 무결성 보장
- 순서 보장
- 자동 재전송
- 흐름 제어

### 단점

- 오버헤드가 큼
- 속도가 상대적으로 느림
- 실시간성이 떨어짐

## UDP (User Datagram Protocol)

### 특징

- **비연결형 (Connectionless)**: 연결 설정 없이 바로 데이터 전송
- **신뢰성 없음**: 데이터 손실 가능성 있음
- **순서 보장 없음**: 패킷 순서가 바뀔 수 있음
- **빠른 전송**: 오버헤드가 적어 빠름

### 동작 과정

```
1. 연결 설정 없음
2. 데이터 전송
   Client → 데이터 → Server
   (재전송, 순서 보장 없음)
3. 연결 해제 없음
```

### 장점

- 빠른 전송 속도
- 실시간성 보장
- 오버헤드가 적음
- 단순한 구조

### 단점

- 데이터 손실 가능성
- 순서 보장 없음
- 신뢰성 없음

## TCP vs UDP 비교

| 구분          | TCP                      | UDP              |
| ------------- | ------------------------ | ---------------- |
| **연결 방식** | 연결 지향적              | 비연결형         |
| **신뢰성**    | 높음 (재전송, 순서 보장) | 낮음 (손실 가능) |
| **속도**      | 상대적으로 느림          | 빠름             |
| **오버헤드**  | 높음                     | 낮음             |
| **실시간성**  | 낮음                     | 높음             |
| **사용 포트** | 1-65535                  | 1-65535          |
| **헤더 크기** | 20-60 bytes              | 8 bytes          |

## 실제 사용 사례

### TCP 사용 사례

#### 1. 웹 브라우징 (HTTP/HTTPS)

```bash
# 웹사이트 접속 시 TCP 사용
curl -v https://www.google.com
# TCP 3-way handshake 후 데이터 전송
```

#### 2. 이메일 (SMTP, POP3, IMAP)

```bash
# 이메일 서버와의 통신
telnet smtp.gmail.com 587
```

#### 3. 파일 전송 (FTP)

```bash
# 파일 업로드/다운로드
ftp ftp.example.com
```

#### 4. SSH (원격 접속)

```bash
# 서버 원격 접속
ssh user@server.com
```

### UDP 사용 사례

#### 1. 실시간 스트리밍

```python
# 예시: 실시간 비디오 스트리밍
import socket

# UDP 소켓 생성
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.sendto(video_frame, ('192.168.1.100', 5000))
```

#### 2. 온라인 게임

```python
# 게임 패킷 전송 예시
game_packet = {
    'player_id': 123,
    'position': {'x': 100, 'y': 200},
    'action': 'move'
}
sock.sendto(json.dumps(game_packet).encode(), (server_ip, game_port))
```

#### 3. DNS 조회

```bash
# DNS 쿼리 (UDP 사용)
nslookup google.com
```

#### 4. DHCP (IP 주소 할당)

```bash
# DHCP 서버로부터 IP 주소 요청
dhclient eth0
```

#### 5. VoIP (음성 통화)

```python
# 음성 데이터 전송
audio_data = capture_audio()
sock.sendto(audio_data, (remote_ip, voice_port))
```

## 정리

### TCP

- **데이터 무결성이 중요한 경우**

  - 파일 전송
  - 이메일 전송
  - 웹 페이지 로딩
  - 데이터베이스 연결

- **순서가 중요한 경우**
  - 텍스트 메시지
  - 문서 전송
  - 로그 데이터

### UDP

- **실시간성이 중요한 경우**

  - 실시간 비디오 스트리밍
  - 온라인 게임
  - VoIP 통화

- **빠른 전송이 필요한 경우**

  - DNS 조회
  - DHCP
  - 실시간 모니터링

- **일부 데이터 손실이 허용되는 경우**
  - 실시간 센서 데이터
  - 로그 데이터 (실시간성 우선)

TCP와 UDP는 각각의 장단점이 있어서, **용도에 맞는 프로토콜을 선택하는 것이 중요**합니다.

- **TCP**: 신뢰성이 중요한 웹, 이메일, 파일 전송 등
- **UDP**: 실시간성이 중요한 스트리밍, 게임, VoIP 등
