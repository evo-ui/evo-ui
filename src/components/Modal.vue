<template>
	<div class="modal" :class="{'open': showing || value, loading}">
		<div v-if="showing || value">
			<div class="outer">

                <div class="inner">
                    <div class="loader-overlay">
                        <div :class="{show: loading}" class="loading-spinner primary"><div class="spinner-icon"></div></div>
                    </div>
                    <div class="options">
                        <i @click="close" class="ex ex-close"></i>
                    </div>
                    <div class="slot">
                        <slot />
                    </div>
                    <div class="btns" v-if="!noFooter">
                        <div class="actions-left">
                            <slot name="actions-left" />
                        </div>
                        <slot name="actions" />
                        <label v-show="submitFor" :for="submitFor" class="btn btn-primary btn-sm" v-text="defaultLang.confirm"></label>
                        <button cy-btn="confirm" v-if="! submitFor && submit" class="btn btn-primary btn-sm" @click="submitModal" v-text="defaultLang.confirm"></button>
                        <button cy-btn="cancel" class="btn btn-default btn-sm" @click="close" v-text="defaultLang.cancel"></button>
                    </div>
                </div>

			</div>
			<!-- <div @click="close" class="blackout"></div> -->
		</div>
</div>
</template>

<script>

export default {
	name: 'Modal',
	created() {
		if( ! this.toggle ) {
			this.showing = false;
		}
	},

	data() {
		return {
			defaultLang: {
				confirm: (this.submit ? 'Save' : 'Ok') + '',
				cancel: 'Cancel'
			},

			showing: true,
			escapeListener: null
		}
	},

	destroyed() {
		if(this.escapeListener) {
			this.escapeListener.off();
		}
	},

	mounted() {
		let self = this;

		if(self.value) {
			self.$emit('shown');
        }

		self.$nextTick(() => {
			self.adjust();

			self.escapeListener = hx.listener.on(document.body, 'keyup', function(event) {
				let skip = ['INPUT', 'TEXTAREA'];
				if(event.keyCode === 27 && self.value && skip.indexOf(event.target.nodeName) === -1) {
					if(self) {
                        self.close();
                    }
				}
			}, false);
		});
	},

	methods: {
		close() {
			let self = this;
			hx.timeout(5, () => {
				self.$emit('hidden', self);
				self.adjust();
			});

			if(self.value !== null && self.value) {
				return self.$emit('change', false);
			}

			if( ! self.toggle ) {
				self.showing = false;
				return false;
			}
			self.$parent[self.toggle] = ! self.$parent[self.toggle];
		},

		inputFocus() {
			let input = this.$el.querySelector('input');
			if( input ) {
				input.focus();
			}
		},

		show() {
			let self = this;
			self.showing = true;
			hx.timeout(5, () => {
				self.$emit('shown', self);
			});
		},
		submitModal() {
			if(! this.submit) return this.close();
			this.$parent[this.submit](this);
		},

		adjust: _.debounce(function() {
			setTimeout(() => hx.event.fire('modal.change', self.value || self.toggle), 0);

			if(!this.toggle && !this.value) {
				return false;
			}

			// if(!this.value || !this.$parent[this.toggle]) {
			// 	// close
			// 	// document.body.style.margin = '';
			// 	// return document.body.style.overflow = '';
			// 	// return modal.style.display = 'none';
			// }



			// Note: fixed elements will also need the margin
			// adjustment (like a fixed header, if you have one).
			// let scrollBarWidth = window.innerWidth - document.body.offsetWidth;
			// document.body.style.margin = '0px ' + scrollBarWidth + 'px 0px 0px';
			// document.body.style.overflow = 'hidden';
			// modal.style.display = 'block';
		}, 2),
	},

	props: {
		toggle: null,
		submit: null,
		lang: {},
		name: '',
		submitFor: '',
		noFooter: {
			'default': false
		},
		value: null,
        loading: null
	},

	watch: {
		toggle(newVal) {
			this.adjust()
		},
		value() {
			this.adjust();

			if(this.value) {
				this.$emit('shown');
            }
		}
	},

	model: {
		event: 'change'
	}

}
</script>
