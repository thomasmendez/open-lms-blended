import chai from "chai";
import React from "react";
import ReactDOM from 'react-dom';
import { Container, Row, Col } from 'react-bootstrap'
import { MemoryRouter } from 'react-router';
import { act } from 'react-dom/test-utils';
import Loading from '../../../src/components/general/Loading'
import { configure, shallow } from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

let expect = chai.expect;

describe("Testing Component - Loading", () => {
    let wrapper;
    beforeEach(() => { wrapper = shallow(<Loading />)})
    
    it("Includes one div class Container", () => {
        expect(wrapper.find(Container)).to.have.lengthOf(1)
    })

    it("Includes one div class Row", () => {
        expect(wrapper.find(Row)).to.have.lengthOf(1)
    })
    
    it("Includes one div class p with text 'Loading...'", () => {
        expect(wrapper.find("p").text()).to.be.equal('Loading...')
    })
    
})