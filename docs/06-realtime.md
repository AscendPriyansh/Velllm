# Real-Time Architecture

Velllm uses Socket.io for real-time whiteboard collaboration and WebRTC via PeerJS for peer-to-peer audio.

## Flow

```text
Client
  ↓
Socket.io
  ↓
Node.js Server
  ↓
Other Clients
```

Audio:

```text
User A ←──── WebRTC ────→ User B
```

## Socket Events

### Client → Server
- `room:join`
- `room:leave`
- `board:operation`
- `cursor:move`

### Server → Client
- `room:user-joined`
- `room:user-left`
- `board:operation`
- `cursor:moved`

## Synchronization

- Local optimistic rendering for immediate feedback.
- Drawing/cursor events throttled to approximately 30ms.
- Board operations are synchronized instead of sending the entire board state.
- Persisted board state is saved separately in PostgreSQL.

## Audio

PeerJS handles WebRTC connections for peer-to-peer audio. Socket.io is used for room coordination/signaling.

## Future

- Conflict resolution / CRDTs
- Redis Socket.io adapter
- WebRTC SFU for larger rooms
- Offline synchronization