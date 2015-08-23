 /**
 * ztInputHint Plugin
 *
 * @version 1.5 (10/11/2010)
 * @requires jQuery v1.3+
 * @author Zeljko Trulec <trulec.de>
 * @copyright Copyright (c) 2010, Zeljko Trulec
 * @see https://code.google.com/p/ztinputhint/
 * 
 * Distributed under the terms of the GNU General Public License
 * http://www.gnu.org/licenses/gpl-3.0.html
 */
/**
 * Add Hints to text- and password-fields in 3 different ways:
 *   - dummy-Fields (will not be submit) [default] or
 *   - classes (change between default- and hint-class) or
 *   - background-images (change between default- and hint-background-images, set with inline-css-style)
 * 
 * @example $("input").ztInputHint();
 * @example $("input#username").ztInputHint('Username');
 * 
 * @example $("input#username").ztInputHint({
 *   hint: 'Benutzername',
 *   sourceAttrib: 'alt',
 *   hintClass: 'icon'
 * });
 * @example $("input#username").ztInputHint({
 * 	    mode: 'background',
 *      hintClass: 'loginlabel',
 *      hintBG: '/images/username.png'
 * });
 * 
 * @example $("input#username").ztInputHint('setHint', 'change-hint-after-init-sample');
 * @example $("input#username").ztInputHint('destroy');
 * 
 * 
 * Methods:
 * setHint(string newHint)   To change (re-set) the hinttext (works just on field-mode)
 * destroyHint()             To remove the hint
 * 
 * 
 * Options:
 * @param hint            Manually specified text to use as hint (will override sourceAttrib)
 * @param mode            how to show hint: 'field' (change Fields) [default]
 *                                          'class' (change classes)
 *                                          'background' (change background-images)
 * @param sourceAttrib    Automatic pick this attribute to use as hint                 [mode:field]
 * @param hintColor       Use this color for hinttext (don't need to use hintClass)    [mode:field]
 * @param hintClass       Classname to use as hint (w/o Text in)                       [mode:field|class]
 * @param defaultClass    Class to use as default (with Text in)                       [mode:class]
 * @param hintBG          Background-Image (url-path) to use as hint (w/o Text in)     [mode:background]
 * @param defaultBG       Background-Image (url-path) to use as default (with Text in) [mode:background]
 *
 * @return jQuery Object
 * @type jQuery
 *
 * @name jQuery.fn.ztinputhint
 * @cat Plugins/Forms
 */
(function($) {

	var ztinputhintOptions = {
			hint: null,                  // manually specified text to use as hint (will override sourceAttrib)
			mode: 'field',               // how to show hint: 'field' (change Fields),
			                             //                   'class' (change Classes),
			                             //                   'background' (change background-images)
			sourceAttrib: 'title',       // automatic pick this attribute to use as hint
			hintColor: '#BBBBBB',        // use this color for hinttext , if hintClass is empty
			hintClass: false,            // Class to use as hint (w/o Text in)
			defaultClass: false,         // Class to use as default (with Text in)
			hintBG: false,               // BG-Image (url-path) to use as hint (w/o Text in)
			defaultBG: false             // BG-Image (url-path) to use as default (with Text in)
	};
	
	// allowed methods to call
	var ztinputhintmehtods = {
	
		init: function(options) {
			
			// if options (as object) are passed, overwrite default settings
			if(options && typeof options == 'object') {
				$.extend(ztinputhintOptions, options);
			}
			
			// if anything is passed as string
			else if(options) {
				ztinputhintOptions.hint = options;
			}
			
			return this.each(function() {
				var container = $(this);
				
				if (!container.is('input:text, input:password')) {
					return false;
				}
				
				
				// #########################################
				// ### Fields-Mode
				// #########################################
				if (ztinputhintOptions.mode == 'field') {
					//alert(container.attr('id') || container.attr('name'));
					
					// w/o name-attrib it will not be submitted
					var dummyName = 'ztInputHint_' + (container.attr('id') || container.attr('name'));
					var dummyInput = '<input type="text" value="" style="display: none;" id="' + dummyName + '" hintFor="' + (container.attr('id') || container.attr('name')) + '" />';
					var textHint = ztinputhintOptions.hint || container.attr(ztinputhintOptions.sourceAttrib);
					var classHint = ztinputhintOptions.hintClass || container.attr('class');
					
					// insert dummy-element in front of the target
					$(dummyInput).insertBefore(container);
					//var dummy = container.prev('input:first');
					var dummy = $('#' + 'ztInputHint_' + ($(this).attr('id') || $(this).attr('name')));
					
					// just if there is a hint and the value of the container is empty
					if (textHint) {
						
						// set attributes of dummy-element
						dummy.attr('class', classHint);
						dummy.attr('size', container.attr('size'));
						dummy.attr('tabIndex', container.attr('tabIndex'));
						dummy.attr('title', ztinputhintOptions.hint || container.attr(ztinputhintOptions.sourceAttrib));
						dummy.val(textHint);
						// set default dummy-color if hintClass is empty and hintColor not empty
						if (!ztinputhintOptions.hintClass && ztinputhintOptions.hintColor) dummy.css('color', ztinputhintOptions.hintColor);
						
						// on focus hide dummy, show real
						dummy.focus(function() {
							$(this).hide();
							var contName = $(this).attr('hintFor');
							//alert(contName);
							cont = $('input#'+contName) || $("input[name='"+contName+"']");
							cont.show();
							cont.focus();
						});
						
						// on blur hide real, show dummy
						container.blur(function() {
							if ($(this).val() == '') {
								$('#' + 'ztInputHint_' + ($(this).attr('id') || $(this).attr('name'))).show();
								$(this).hide();
							}
						});
						
						
						// initialize
						container.blur();
					}
				}
				
				
				// #########################################
				// ### Class-Mode
				// #########################################
				else if (ztinputhintOptions.mode == 'class') {
					
					// on blur
					container.blur(function() {
						
						// if empty
						if ($(this).val() == '') {
							
							// remove default class
							if (ztinputhintOptions.defaultClass != false && container.hasClass(ztinputhintOptions.defaultClass)) container.removeClass(ztinputhintOptions.defaultClass);
							
							// set hintClass
							if (ztinputhintOptions.hintClass != false && !container.hasClass(ztinputhintOptions.hintClass)) container.addClass(ztinputhintOptions.hintClass);
							
						}
						
					});
					
					// on focus
					container.focus(function() {
						
						// remove hintClass
						if (ztinputhintOptions.hintClass != false && container.hasClass(ztinputhintOptions.hintClass)) container.removeClass(ztinputhintOptions.hintClass);
						
						// set defaultClass
						if (ztinputhintOptions.defaultClass != false && !container.hasClass(ztinputhintOptions.defaultClass)) container.addClass(ztinputhintOptions.defaultClass);
						
					});
					
					// initialize
					container.blur();
				}
				
				
				// #########################################
				// ### Background-Mode
				// #########################################
				else if (ztinputhintOptions.mode == 'background') {
					
					container.css('background-position', 'center left');
					container.css('background-repeat', 'no-repeat');
					container.css('background-color', 'transparent');
					container.css('background-attachment', 'scroll');
					
					// on blur
					container.blur(function() {
						
						// set hintBG
						if ($(this).val() == '' && ztinputhintOptions.hintBG != '') container.css('background-image', 'url('+ztinputhintOptions.hintBG+')');
						
					});
					
					// on focus
					container.focus(function() {
						
						// remove hintBG
						container.css('background-image', '');
						
						// set defaultBG
						if (ztinputhintOptions.defaultBG != '' && container.css('background-image') != 'url('+ztinputhintOptions.defaultBG+')') {
							container.css('background-image', 'url('+ztinputhintOptions.defaultBG+')');
						}
						
					});
					
					// initialize
					container.blur();
				}
			});
		},
		
		/**
		 * destroy hint
		 */
		destroyHint: function() {
			alert('destroy');
			
			return this.each(function() {
				$('#' + 'ztInputHint_' + ($(this).attr('id') || $(this).attr('name'))).remove();
				$(this).unbind('blur').unbind('focus');
			});
		},
		
		/**
		 * Just on Fileds-Mode to re-set hinttext
		 * @param string
		 */
		setHint: function(strHint) {
			
			if (ztinputhintOptions.mode == 'field') {
				return this.each(function() {
					var dummy = $("input[hintFOR='" + ($(this).attr('id') || $(this).attr('name')) + "']");
					dummy.val(strHint);
					dummy.attr('title', strHint);
					$(this).attr('title', strHint);
				});
			}
			else return this;
		}
	};
	
	/**
	 * constructor to chek for init or method-call
	 */
	$.fn.ztinputhint = function( method ) {
		
		// call a method
		if ( ztinputhintmehtods[method] ) {
			return ztinputhintmehtods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		
		// initialize
		else {
      return ztinputhintmehtods.init.apply( this, arguments );
    }
	};
	
	$.fn.ztInputHint = $.fn.ztinputhint;
})(jQuery);