import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import SnakeGame from '../SnakeGame'

// 타이머 모킹
vi.useFakeTimers()

describe('SnakeGame', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  it('게임 초기 상태를 올바르게 렌더링한다', () => {
    render(<SnakeGame />)
    
    expect(screen.getByText('스네이크 게임')).toBeInTheDocument()
    expect(screen.getByText('점수: 0')).toBeInTheDocument()
    expect(screen.getByText('스페이스바를 눌러 게임을 시작하세요!')).toBeInTheDocument()
    expect(screen.getByText('방향키로 뱀을 조작하세요')).toBeInTheDocument()
  })

  it('뱀의 초기 위치와 음식 위치가 표시된다', () => {
    render(<SnakeGame />)
    
    // 디버그 정보에서 초기 위치 확인
    expect(screen.getByText(/뱀 위치: \(10, 10\)/)).toBeInTheDocument()
    expect(screen.getByText(/음식: \(15, 15\)/)).toBeInTheDocument()
    expect(screen.getByText(/길이: 1/)).toBeInTheDocument()
  })

  it('스페이스바를 누르면 게임이 시작된다', () => {
    render(<SnakeGame />)
    
    // 게임 시작 전
    expect(screen.getByText('스페이스바를 눌러 게임을 시작하세요!')).toBeInTheDocument()
    
    // 스페이스바 누르기
    fireEvent.keyDown(document, { code: 'Space' })
    
    // 게임 시작 후
    expect(screen.getByText('방향키: 이동')).toBeInTheDocument()
    expect(screen.getByText('목표: 빨간 음식을 먹어 점수를 올리세요!')).toBeInTheDocument()
  })

  it('방향키로 뱀의 방향을 변경할 수 있다', async () => {
    render(<SnakeGame />)
    
    // 게임 시작
    fireEvent.keyDown(document, { code: 'Space' })
    
    // 위쪽 방향키 누르기
    fireEvent.keyDown(document, { key: 'ArrowUp' })
    
    // 게임 루프 실행
    await act(async () => {
      vi.advanceTimersByTime(100)
    })
    
    // 뱀이 위로 이동했는지 확인 (y 좌표가 감소)
    expect(screen.getByText(/뱀 위치: \(10, 9\)/)).toBeInTheDocument()
  })

  it('게임 그리드가 올바른 크기로 렌더링된다', () => {
    render(<SnakeGame />)
    
    // 그리드 컨테이너 확인
    const container = document.querySelector('[style*="grid-template-columns"]')
    expect(container).toBeInTheDocument()
    
    // 그리드 스타일 확인
    expect(container).toHaveStyle('grid-template-columns: repeat(20, 1fr)')
  })

  it('키보드 이벤트가 기본 동작을 방지한다', () => {
    render(<SnakeGame />)
    
    const preventDefaultSpy = vi.fn()
    
    // 커스텀 이벤트 생성
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
    event.preventDefault = preventDefaultSpy
    
    // 이벤트 발생
    document.dispatchEvent(event)
    
    // preventDefault가 호출되었는지 확인
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('게임이 시작되면 뱀이 이동한다', async () => {
    render(<SnakeGame />)
    
    // 게임 시작
    fireEvent.keyDown(document, { code: 'Space' })
    
    // 초기 위치 확인
    expect(screen.getByText(/뱀 위치: \(10, 10\)/)).toBeInTheDocument()
    
    // 게임 루프 실행 (오른쪽으로 이동)
    await act(async () => {
      vi.advanceTimersByTime(100)
    })
    
    // 뱀이 오른쪽으로 이동했는지 확인
    expect(screen.getByText(/뱀 위치: \(11, 10\)/)).toBeInTheDocument()
  })

  it('반대 방향으로는 이동할 수 없다', async () => {
    render(<SnakeGame />)
    
    // 게임 시작 (초기 방향: 오른쪽)
    fireEvent.keyDown(document, { code: 'Space' })
    
    // 한 번 이동
    await act(async () => {
      vi.advanceTimersByTime(100)
    })
    
    // 오른쪽으로 이동했는지 확인
    expect(screen.getByText(/뱀 위치: \(11, 10\)/)).toBeInTheDocument()
    
    // 왼쪽 방향키 누르기 (반대 방향)
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    
    // 한 번 더 이동
    await act(async () => {
      vi.advanceTimersByTime(100)
    })
    
    // 여전히 오른쪽으로 이동해야 함
    expect(screen.getByText(/뱀 위치: \(12, 10\)/)).toBeInTheDocument()
  })

  it('게임 오버 후 스페이스바를 누르면 게임이 리셋된다', async () => {
    render(<SnakeGame />)
    
    // 게임 시작
    fireEvent.keyDown(document, { code: 'Space' })
    
    // 왼쪽으로 방향 변경 (벽으로 이동)
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    
    // 충분히 이동하여 벽에 부딪히게 함
    await act(async () => {
      for (let i = 0; i < 15; i++) {
        vi.advanceTimersByTime(100)
      }
    })
    
    // 게임 오버 확인
    expect(screen.getByText('게임 오버!')).toBeInTheDocument()
    
    // 스페이스바로 게임 리셋
    fireEvent.keyDown(document, { code: 'Space' })
    
    // 게임이 리셋되었는지 확인
    expect(screen.getByText('점수: 0')).toBeInTheDocument()
    expect(screen.getByText(/뱀 위치: \(10, 10\)/)).toBeInTheDocument()
    expect(screen.getByText('스페이스바를 눌러 게임을 시작하세요!')).toBeInTheDocument()
  })

  it('컴포넌트가 언마운트될 때 이벤트 리스너가 제거된다', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    
    const { unmount } = render(<SnakeGame />)
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    
    removeEventListenerSpy.mockRestore()
  })

  it('게임 상태가 올바르게 표시된다', () => {
    render(<SnakeGame />)
    
    // 초기 상태
    expect(screen.getByText('점수: 0')).toBeInTheDocument()
    expect(screen.getByText(/길이: 1/)).toBeInTheDocument()
    
    // 게임 시작
    fireEvent.keyDown(document, { code: 'Space' })
    
    // 게임 진행 중 상태
    expect(screen.getByText('방향키: 이동')).toBeInTheDocument()
    expect(screen.getByText('목표: 빨간 음식을 먹어 점수를 올리세요!')).toBeInTheDocument()
  })
}) 