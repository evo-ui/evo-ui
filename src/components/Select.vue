<template>
	<div class="select2" :class="{ 'active': show, selected, disabled }">
		<div class="value" @keydown.space.prevent.stop="toggleShow" @keyup.esc="close">
			<div @click="toggleShow" class="trigger input element" :class="{ empty: (!elementsInstance || !elementsInstance.length) }" tabindex="0" @focus="onFocus">
				<div v-if="multiple && values && values.length">
					<div v-for="(val, index) in selected" :key="index" class="tag">
						<span :cy-select-value="elementId + ' ' + index" v-html="renderValue(val)"></span><i @click.stop="removeTag(val[elementId])" class="ex ex-close"></i>
					</div>
				</div>
				<span v-else v-html="selectedValueOutput || '&nbsp;'" :cy-select-value="name" ></span>
			</div>
			<label @click="toggleShow" v-show="(multiple && !values) && ! selected" class="label" v-text="placeholder"></label>
			<i v-show="!noClear" @click="clear" class="ex ex-close close"></i>
		</div>
		<div class="dropcontainer" v-show="show">
			<input v-model="searchQuery"
				   v-show="addable || (elementsInstance && elementsInstance.length)"
				   type="text"
				   name="filter"
				   class="input filter"
				   autocomplete="off"
				   @input="onInput"
				   @click.stop.prevent="focus"
				   @keyup.esc="close"
				   @keyup.enter="selectValueOnEnter"
				   @keydown.tab="onFocusOut"
				   :placeholder="'Filter' + (addable ? ' or add' : '') + '...'" />
			<ul class="dropdownvisible" v-if="elementsInstance">
<!--                <template v-if="!isGrouped">-->
                    <li v-for="(element, index) in filteredElements" :key="index" @click.stop="select(element, true)" :cy-select-item="element[elementValue] || element">
                        <span v-html="(elementValueFn || (attrs && attrs.elementValueFn)) ? renderValue(element) : element[elementValue] || element"></span>
                    </li>
<!--                </template>-->
<!--                <template v-if="isGrouped">-->

<!--                </template>-->
			</ul>
			<div v-if="create" class="create" @click="doCreateAction(this)">
				<i class="ex ex-plus"></i>
				<span v-text="create.label"></span>
			</div>
		</div>
	</div>
</template>



<script>
	export default {

		/**
		 * replace html
		 */
		replace: true,

		/**
		 *
		 * Data
		 *
		 */
		data() {
			let self = this;
			return {
				bindHide(e) {
					if(e) {
						e.preventDefault();
						e.stopPropagation();
						if(e.srcElement.type !== 'submit') {
							self.show = false;
						}
					}
					document.removeEventListener('click',self.bindHide,false);
				},
				$input: null,
				elementsInstance: null,
				modelInstance: null,
				newValueCounter: 0,
				searchQuery: '',
				selected: null,
				show: false,
				// multiple: true,
				// values: [],
				// placeholder: '',
			}
		},

		/**
		 * Properties
		 */
		props: {
			addable: false,
			attrs: null,
			create: null,
			elementId: { default: 'id' },
			elements: null,
			elementValue: { default: 'value' },
			elementValueFn: null,
			model: '',
			modelKey: String,
			multiple: false,
			name: String,
			noClear: { default: false },
			placeholder: null,
			url: '',
			value: null,
			placeholderHideOnSelected: false,
			watchOnChange: null,
			disabled: null,
            resultFormat: null,
			cache: {
				'default': true
			},
			loadOnRender: {
				default: true
			},
			useXhrFilter: {
				'default': false
			},
            clearOnClose: {
                'default': false
            },
            selectedValueRender: null,
            closeOnSelect: null,
            placement: {
                'default': 'bottom'
            },
            autofocus: null,
            groupBy: null,
			// urlKey: '',
		},

		computed: {

			isGrouped() {
				return this.groupBy;
            },

			selectedValueOutput() {
				let self = this;
				if(self.selected && self.elementValue) {
					return self.renderValue(self.selected);
				}

				if(self.filteredElements && self.filteredElements.length && self.values) {
					let element = self.filteredElements.find(item => item[self.elementId] == self.values);

					if(element) {
						return self.elementValueFn ? self.elementValueFn(element) : element[self.elementValue];
					}
				}

				return self.placeholder;

				// (selected && elementValue ? renderValue(selected) : '&nbsp;')
			},
			filteredElements() {
				let self = this;
				if(self.url && self.useXhrFilter) {
					return self.elementsInstance;
				}

				if(this.multiple) {
					let elements = this.elements || this.elementsInstance;
					let search = this.searchQuery && self.searchQuery.trim() !== '' ? self.searchQuery.trim() : null;
					let selected = [];

					if(this.values) {
						for(let item of this.values) {
							selected.push(item);
						}
					}

					// if((search || this.values) && elements) {
					if(search || this.values && elements) {
						let filtered = [];
						for(let element of elements) {
							if(selected && selected.indexOf(element[this.elementId]) === -1) {
								filtered.push(element);
							}
							else if(search && element[this.elementValue] && element[this.elementValue].toLowerCase().indexOf(search) !== -1) {
								filtered.push(element);
							}
						}
						elements = filtered;
					}

					return elements;
				}

				if(!this.elementsInstance) {
					return this.elementsInstance;
				}

				if(this.elementsInstance instanceof Array && this.elementValue) {
					return this.elementsInstance.filter(item => {
						return item[this.elementValue] && (item[this.elementValue].toLowerCase()).indexOf(this.searchQuery) !== -1;
						// return item[this.elementValue] && (item[this.elementValue].toLowerCase()).indexOf(this.searchQuery) !== -1;
					})
				}
				// | filterBy searchQuery
				return this.elementsInstance;
			},

			values: {
				get() {
					let self = this;
					if(!self.value && self.multiple ) {
						return [];
					}

					if(self.elementsInstance && self.multiple){
						return self.elementsInstance.filter((item) => self.value.indexOf[item[self.elementId]] !== -1 );
					}

					return this.value;
				},
				set(value) {
					this.$emit('change', value)
				}
			}
		},

		/**
		 *
		 * onReady
		 *
		 */
		mounted() {
			let self = this;

			if(self.name) {
				self.on('select.focus.' + self.name, () => {
					self.toggleShow();
				});

				self.on('select.clear.' + self.name, () => {
					self.clear();
				});

				self.on('select.elements.' + self.name, values => {
					self.setElements(values);
				})
			}

			// document.removeEventListener('click',this.bindHide,false);
			self.$nextTick(function() {
				self.modelInstance = self.model;
				self.elementsInstance = self.elements;

				// if( self.attrs ) {
				// 	let attr = null;
				// 	for(attr in self.attrs) self[attr] = self.attrs[attr];
				// }

				self.$input = self.$el.getElementsByTagName('input')[0];

				if( typeof self.elementsInstance === 'string' ) {
					if( this.$parent.constructor.name === 'AppForm' ) {
						self.elementsInstance = app.fn.dot('data', self.$parent.$parent[self.elementsInstance]);
					} else {
						self.elementsInstance = app.fn.dot('data', self.$parent[self.elementsInstance]);
					}
				}

				self.setModelInstance();

				if( self.url && self.loadOnRender ) {
					setTimeout(() => {
						self.getFromRemote(self.url, true);
					}, 10);
				}

				if(self.modelKey){
					// self.$watch('model', (a, b,c) => {
					// 	self.selectSelectedValue()
					// });
					self.selectSelectedValue();
				}
			})
		},

		model: {
			event: 'change'
		},

		watch: {
			value: function(newValue, oldValue) {
				if(!this.watchOnChange) {
					return;
				}

				let value = null;
				if( newValue ) {
					value = this.findElementById(newValue);
				}

				this.selected = value || null;
			},
			// 'elements' : function() {
			// 	this.selectSelectedValue();
			// },
			// searchQuery() => {
			// 	this.performSearchQuery();
			// }
		},

		/**
		 *
		 * Methods
		 *
		 */

		methods: {

			onFocusOut: function() {
				let self = this;

				// self.show = false;

				console.log('to do: implement me!! (select::onFocusOut)');
			},

			onFocus: function(ev) {
				let self = this;

				if(!self.show && self.disabled) {
					return;
				}

				console.info('to do: implement me!! (select::onFocus)');

				// self.show = true;

				// console.log(ev);

				// self.onOpen(false);
			},

			onInput: _.debounce(function() {
				if(this.useXhrFilter) {
					this.getFromRemote();
				}
			}, 250),

			// bindHide(e) {
			//     console.log('her', e);
			//     if(!e) {
			//         return;
			//     }
			//     e.stopPropagation();
			//     if( this.show ) {
			//         this.show = false;
			//     }
			//     document.removeEventListener('click',this.bindHide,false);
			// },

			bindInputEvents(input) {
				let self = this;
				app._.on(input, 'click', function(e) {
					if( self.show ) {
						return true;
					}
					self.show = true;
					setTimeout(function(){
						document.addEventListener('click',self.bindHide,false);
					},100);
				})
			},

			focus(e) {
				e.preventDefault();
				return false;
			},

			eventChangeTrigger() {
				helper.event(this.$input, 'change');
				this.$emit('change', this.getValue(), this.selected);
			},

			/**
			 * Clear selected value of select2
			 */
			clear() {
				let self = this;
				if(self.modelInstance) {
					self.modelInstance[self.modelKey] = null;
				}
				self.selected = null;
				self.values = [];
				self.show = false;

				self.eventChangeTrigger();
			},

			close() {
				this.show = false;
			},

			/**
			 * Default value select
			 * @return {[type]} [description]
			 */
			defaultSelect() {
				// let items = Vue.options.filters.filterBy(this.elements, this.searchQuery);
				let items = this.filteredElements;

				if( items.length ) {
					this.select(items[0], true);
				} else {
					this.select(null, true);
					// this.show = false;
				}
				this.searchQuery = '';
			},

			/**
			 * Perform 'create' action given in the prop 'create'
			 */
			doCreateAction() {
				let self = this;

				if(typeof self.create === 'function') {
					self.create(self);
				}
				else if( ! self.$parent[self.create.action] ) {
					self.$parent.$parent[self.create.action](self);
				} else {
					self.$parent[self.create.action](self);
				}
				self.toggleShow();
			},

			findElementById(id) {
				let self = this;
				let elements = self.elementsInstance;
				if( elements ) {
					for (let i = 0; i < elements.length; i++) {
						if( elements[i][self.elementId] === id ) {
							return elements[i];
						}
					}
				}
				return null;
			},

            /**
             * Get the value from a remote url
             */
            getFromRemote(url = null, initial = false) {
                let self = this;
                if( ! url ) {
                    url = self.url;
                }

                let data = {};
                if(self.searchQuery && self.searchQuery.trim() !== '') {
                    data.q = self.searchQuery.trim();
                }

                if(initial && (self.values || self.value)) {
                    data.id = self.values || self.value;
                }

                if(_.isArray(data.id)) {
                    data.id = data.id.length ? data.id : null;
                }

                self.$http.get(url, data, function(resp) {
                    if(helper.invalid(resp)) {
                        return;
                    }
                    let result = app.dot('data', resp);

                    if(result && initial && result.length && typeof data.id !== 'undefined' && data.id) {
                        self.selected = result[0];
                    } else {
                        self.elementsInstance = result;
                    }

                    self.$emit('data-fetch', result);

                    // if(! self.selected && self.modelKey && self.model) {
                    // 	self.selectSelectedValue();
                    // }
                });
            },

			isInValue(obj) {
				if( ! this.multiple ) {
					return true;
				}

				for(let item of this.values) {
					if(item[this.elementId] == obj[this.elementId]) {
						return true;
					}
				}

				return false;

				// return this.values.indexOf(obj[this.elementId]) === -1 && this.values.indexOf(obj) === -1;
			},

			/**
			 * Reload select data from API
			 */
			reload() {
				this.getFromRemote()
			},

			/**
			 * Remove tag
			 */
			removeTag(obj) {
				if( this.values && this.values.indexOf(obj) !== -1 ) {
					let index = this.values.indexOf(obj);
					this.values.splice(index, 1)
				}
				// this.values.$remove(obj[this.elementId]);
				let index = this.values.indexOf(this.elementId);
				if(index !== -1) {
					this.values.splice(index, 1);
				}
				if( ! this.values.length ) {
					this.clear();
				}

				this.$emit('removed', obj);
			},

			renderValue(value) {
				let func = this.elementValueFn || (this.attrs && this.attrs.elementValueFn ? this.attrs.elementValueFn : null);
				return func ? func(value) : typeof value === 'object' && value ? value[this.elementValue] : value;
			},

			/**
			 * Reset select2. see clear()
			 */
			reset() {
				this.clear();
			},

			/**
			 * Select value
			 */
			select(value, hide, preventChange) {
				let self = this;
				self.setModelInstance();

				let isNewElement = typeof value === 'number' && value < 0;

				if( isNewElement ) {
					value = this.findElementById(value);
				}

				if( self.multiple ) {
					if( self.values && ! self.values.find((item) => item[self.elementId] == value[self.elementId] )) {

						self.values.push(value);
						self.$emit('added', value);
					}
					value = self.values;
				}
				else {
					self.show = false;
				}

				self.selected = value;

				if( self.elementId && self.value ) {
					value = value[self.elementId];
				}
				self.modelInstance[self.modelKey] = value;

				if( ! preventChange || typeof preventChange === 'undefined' ) {
					setTimeout(function() {
						self.eventChangeTrigger();
					}, 25);
				}

				if( hide ) {
					self.bindHide();
				}
			},

			selectSelectedValue() {
				let self = this;

				self.setModelInstance();

				if( ! (self.modelInstance && self.modelKey && self.elementsInstance && self.elementsInstance.length) ) {
					return false;
				}

				let found = null, selectedValue = self.modelInstance[self.modelKey];
				for (let i = self.elementsInstance.length - 1; i >= 0; i--) {
					if(self.elementsInstance[i][self.elementId] == selectedValue) {
						found = self.elementsInstance[i];
						break;
					}
				}

				if( found ) {
					self.select(found, false, true);
				}
				else self.selected = null;
			},

			/**
			 * Listen on enter
			 */
			selectValueOnEnter(e) {
				let self = this;
				// if(self.addable) {
					e.preventDefault();
					e.stopPropagation();
                // }

				if( self.addable && self.searchQuery ) {
					let newElement = {};
					self.newValueCounter++;
					newElement[ self.elementValue ] = self.searchQuery;
					newElement[ self.elementId ] = - self.newValueCounter;
					self.elementsInstance.push(newElement);
					self.select(-self.newValueCounter);
					self.searchQuery = '';
				} else {
					self.defaultSelect();
				}
				return false;
			},

			setElements(data) {
				this.elementsInstance = data;
			},

			setModelInstance() {
				let self = this;
				if( ! self.modelInstance ) {
					self.modelInstance = self.$parent;
				}
				else if( typeof self.modelInstance === 'string' ) {
					self.modelInstance = self.$parent[self.modelInstance];
				}
			},

			/**
			 * Toggle show the select
			 */
			toggleShow() {
				let self = this;
				if(!self.show && self.disabled) {
					return;
				}

				self.show = ! self.show;

				if( self.show ) {
					self.onOpen();
				}
			},

			onOpen: function(bind = true) {
				let self = this;
				if(self.url && (!self.loadOnRender || !self.cache || (self.selected && !self.elementsInstance))) {
					self.getFromRemote();
				}

				setTimeout(function() {
					self.$input.focus();
					if(bind) {
						document.addEventListener('click',self.bindHide,false);
					}
				}, 100);
			},

			getValue() {
				if( ! this.selected ) return null;
				if( ! this.modelKey ) return this.selected;
				if( ! this.multiple ) return this.selected[this.elementId];
				if( this.modelKey ) {
					let values = [];
					for (let i = this.selected.length - 1; i >= 0; i--) {
						values.push(this.selected[i][this.elementId]);
					}
					return values;
				}
				return null;
			}
		},

	}
</script>
