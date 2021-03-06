import React from 'react';
import Tooltip from 'rc-tooltip';
import Autosuggest from 'react-autosuggest';
import 'whatwg-fetch';

import BaseComponent from '../BaseComponent';
import {DecorateInputFieldWithSymbol} from '../../widgets/Decorator.js';
import EmployerStyle from './Employer.scss';
import SpriteStyle from '../../widgets/Sprite.scss'

export default class Employer extends BaseComponent {
    state = {
        selectedEmployer: this.props.value || '',
        suggestions: []
    }

    render() {
        const { selectedEmployer, suggestions } = this.state;
        return (
            <div className={EmployerStyle.employerContainer}>
                <div className={EmployerStyle.employerContainerInner}>
                <Tooltip placement="rightTop" trigger='focus' defaultVisible={true} overlay={<span>Psst! Don't worry if you don't find your company name on our list! Simply type in the name & proceed! We've got your back!</span>}>
                    <DecorateInputFieldWithSymbol iconStyle={SpriteStyle.symbolBank}>
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionSelected={this.handleEmployerSelection}
                        shouldRenderSuggestions={(value) => value.trim().length > 2}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={() => this.setState({suggestions: []})}
                        getSuggestionValue={suggestion => suggestion}
                        renderSuggestion={(suggestion) => (<div>{suggestion}</div>)}
                        inputProps={{value: selectedEmployer, placeholder:'Type your company name..', onChange: this.onUserTypingValue}}
                    />
                    </DecorateInputFieldWithSymbol>
                </Tooltip>
                </div>
            </div>
        );
    }

    handleEmployerSelection = (event, {suggestion, suggestionValue}) => {
        this.setState({selectedEmployer: suggestionValue}, () => {this.notifyCompletion()});
    }

    onUserTypingValue = (event, { newValue }) => {
        this.setState({selectedEmployer: newValue});
    };

    onSuggestionsFetchRequested = ({ value }) => {
        const inputValue = value.trim().toLowerCase();

        //TODO: Hack to get the data to work in standalone mode. When integrating with Struts this should be made as /autoComplete.html
        let url = 'https://www.bankbazaar.com/autoComplete.html?ajax=true&type=COMPANY&jsonp_callback=bbCallback&query=' + inputValue;
        let self = this;
        fetch(url)
            .then(function(response) {
                return response.text()
            }).then(function(jsonpCallbackString) {
                return JSON.parse(jsonpCallbackString.replace('bbCallback(', '').slice(0, -1))
            }).then(function(options) {
                self.setState({suggestions: options})
            }).catch(function(ex) {
                console.log('Fetching/Parsing the data for the list of available Employers failed', ex)
            });
    };


    getData() {
        return {[this.props.modelKey]: this.state.selectedEmployer};
    }

    validate() {
        if (this.state.selectedEmployer) {
            return true;            
        } else {
            this.props.handler.showError("Uh-oh! Please pick an employer");
            return false;
        }
    }    
}