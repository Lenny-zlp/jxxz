"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var utils_1 = require("../common/utils");
component_1.VantComponent({
    field: true,
    relation: {
        name: 'radio-group',
        type: 'ancestor',
        linked: function (target) {
            this.parent = target;
        },
        unlinked: function () {
            this.parent = null;
        }
    },
    classes: ['icon-class', 'label-class'],
    props: {
        value: null,
        disabled: Boolean,
        useIconSlot: Boolean,
        checkedColor: String,
        labelPosition: {
            type: String,
            value: 'right'
        },
        labelDisabled: Boolean,
        shape: {
            type: String,
            value: 'round'
        },
        iconSize: {
            type: null,
            observer: 'setIconSizeUnit'
        }
    },
    data: {
        iconSizeWithUnit: '20px'
    },
    methods: {
        setIconSizeUnit: function (val) {
            this.setData({
                iconSizeWithUnit: utils_1.addUnit(val)
            });
        },
        emitChange: function (value) {
            var instance = this.parent || this;
            instance.$emit('input', value);
            instance.$emit('change', value);
        },
        onChange: function (event) {
            this.emitChange(this.data.name);
        },
        onClickLabel: function () {
            var _a = this.data, disabled = _a.disabled, labelDisabled = _a.labelDisabled, name = _a.name;
            if (!disabled && !labelDisabled) {
                this.emitChange(name);
            }
        }
    }
});
