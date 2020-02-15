import React from 'react';

interface Props {
    xs?:boolean
    sm?:boolean
    md?:boolean
    lg?:boolean
    xl?:boolean
    style?:any
}

export class MediaQuery extends React.Component<Props> {

    state = {
        dimension:'xl'
    }

    componentDidMount() {
        this.updateDimension()
        window.addEventListener('resize', this.updateDimension)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimension)
    }

    updateDimension = () => {
        if (this.xs() && this.state.dimension !== 'xs') this.setState({dimension:'xs'})
        else if (this.sm() && this.state.dimension !== 'sm') this.setState({dimension:'sm'})
        else if (this.md() && this.state.dimension !== 'md') this.setState({dimension:'md'})
        else if (this.lg() && this.state.dimension !== 'lg') this.setState({dimension:'lg'})
        else if (this.xl() && this.state.dimension !== 'xl') this.setState({dimension:'xl'})
    }

    xs = ()=> window.matchMedia('(max-width: 575px)').matches
    sm = ()=> window.matchMedia('(min-width: 576px) and (max-width: 767px)').matches
    md = ()=> window.matchMedia('(min-width: 768px) and (max-width: 991px)').matches
    lg = ()=> window.matchMedia('(min-width: 992px) and (max-width: 1199').matches
    xl = ()=> window.matchMedia('(min-width: 1200px').matches

    render() {
        return <div style={this.props.style}>
            {this.state.dimension === 'xs' && this.props.xs && this.props.children}
            {this.state.dimension === 'sm' && this.props.sm && this.props.children}
            {this.state.dimension === 'md' && this.props.md && this.props.children}
            {this.state.dimension === 'lg' && this.props.lg && this.props.children}
            {this.state.dimension === 'xl' && this.props.xl && this.props.children}
        </div>
    }
} 