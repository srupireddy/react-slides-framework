import React from 'react';

import {DecorateWithImageAndLabel} from '../widgets/Decorator';

import EmploymentTypeStyle from './EmploymentType.scss';

const titleCase = require('title-case');

export default class EmploymentType extends React.Component {
    static options = ['SALARIED', 'SALARIED_PROFESSIONAL', 'SELF_EMPLOYED_BUSINESS', 'SELF_EMPLOYED_PROFESSIONAL', 'STUDENT', 'RETIRED', 'HOMEMAKER'];

    constructor(props) {
        super(props);
    }

    render() {
        let radioItems = EmploymentType.options.map(
            (option) => (
                <DecorateWithImageAndLabel key={option} containerStyle="col-md-3 col-xs-3 col-sm-3 float-none inline-block" imageStyle={EmploymentTypeStyle['icon' + titleCase(option).replace(/ /g, '')]} label={titleCase(option)}>
                    <input type="radio" value={option}
                        name='employmentType' onChange={this.handleEmploymentTypeSelection} checked={this.props.data === option.value}/>
                </DecorateWithImageAndLabel>
            )
        );

        return (
            <div className={EmploymentType.container}>
                {radioItems}
            </div>            
        )
    }

    handleEmploymentTypeSelection = (event) => {
        let value = event.target.value;
        this.props.onCompletionOfAction(value);
    }
}