import { Component } from 'react'

export class SceneBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: false }
  }

  static getDerivedStateFromError() {
    return { error: true }
  }

  render() {
    if (this.state.error) return this.props.fallback
    return this.props.children
  }
}
