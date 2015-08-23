 /**
 * ztInputHint Plugin
 *
 * @version 1.4 (10/05/2010)
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
 * @example  $("input#username").ztInputHint({
 * 	    mode: 'background',
 *      hintClass: 'loginlabel',
 *      hintBG: '/images/username.png'
 * });
 * 
 * @param hint            Manually specified text to use as hint (will override sourceAttrib)
 * @param mode            how to show hint: 'field' (change Fields) [default]
 *                                          'class' (change Classes)
 *                                          'background' (change background-images)
 * @param sourceAttrib    Automatic pick this attribute to use as hint                 [mode:field]
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
(function($){
	$.fn.ztinputhint = function(options) {
		var defaults = {
			hint: null,                           // manually specified text to use as hint (will override sourceAttrib)
			mode: 'field',                        // how to show hint: 'field' (change Fields),
                                                  //                   'class' (change Classes),
                                                  //                   'background' (change background-images)
			sourceAttrib: 'title',                // automatic pick this attribute to use as hint
			hintClass: false,                     // Class to use as hint (w/o Text in)
			defaultClass: false,                  // Class to use as default (with Text in)
			hintBG: false,                        // BG-Image (url-path) to use as hint (w/o Text in)
			defaultBG: false                      // BG-Image (url-path) to use as default (with Text in)
		};
		
		// if options (as object) are passed, overwrite default settings
		if(options && typeof options == 'object') {
			$.extend(defaults, options);
		}
		
		// if anything is passed as string
		else if(options) {
			defaults.hint = options;
		}
		
		return this.each(function() {
			var container = $(this);
			
			if (!container.is('input:text, input:password')) {
				return false;
			}
			
			
			// #########################################
			// ### Fields-Mode
			// #########################################
			if (defaults.mode == 'field') {
				// w/o name-attrib it will not be submitted
				var dummyName = 'ztInputHint_' + container.attr('name');
				var dummyInput = '<input type="text" value="" style="display: none;" />';
				var textHint = defaults.hint || container.attr(defaults.sourceAttrib);
				var classHint = defaults.hintClass || container.attr('class');
				
				// insert dummy-element in front of the target
				$(dummyInput).insertBefore(container);
				var dummy = container.prev('input:first');
				
				// just if there is a hint and the value of the container is empty
				if (textHint) {
					
					// set attributes of dummy-element
					dummy.attr('class', classHint);
					dummy.attr('size', container.attr('size'));
					dummy.attr('tabIndex', container.attr('tabIndex'));
					dummy.val(textHint);
					
					// on focus hide dummy, show real
					dummy.focus(function() {
						// $(this) = dummy
						$(this).hide();
						cont = $(this).next('input:first');
						cont.show();
						cont.focus();
					});
					
					// on blur hide real, show dummy
					container.blur(function() {
						if ($(this).val() == '') {
							$(this).prev('input:first').show();
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
			else if (defaults.mode == 'class') {
				
				// on blur
				container.blur(function() {
					
					// if empty
					if ($(this).val() == '') {
						
						// remove default class
						if (defaults.defaultClass != false && container.hasClass(defaults.defaultClass)) container.removeClass(defaults.defaultClass);
						
						// set hintClass
						if (defaults.hintClass != false && !container.hasClass(defaults.hintClass)) container.addClass(defaults.hintClass);
						
					}
					
				});
				
				// on focus
				container.focus(function() {
					
					// remove hintClass
					if (defaults.hintClass != false && container.hasClass(defaults.hintClass)) container.removeClass(defaults.hintClass);
					
					// set defaultClass
					if (defaults.defaultClass != false && !container.hasClass(defaults.defaultClass)) container.addClass(defaults.defaultClass);
					
				});
				
				// initialize
				container.blur();
			}
			
			
			// #########################################
			// ### Background-Mode
			// #########################################
			else if (defaults.mode == 'background') {
				
				container.css('background-position', 'center left');
				container.css('background-repeat', 'no-repeat');
				container.css('background-color', 'transparent');
				container.css('background-attachment', 'scroll');
				
				// on blur
				container.blur(function() {
					
					// set hintBG
					if ($(this).val() == '' && defaults.hintBG != '') container.css('background-image', 'url('+defaults.hintBG+')');
					
				});
				
				// on focus
				container.focus(function() {
					
					// remove hintBG
					container.css('background-image', '');
					
					// set defaultBG
					if (defaults.defaultBG != '' && container.css('background-image') != 'url('+defaults.defaultBG+')') {
						container.css('background-image', 'url('+defaults.defaultBG+')');
					}
					
				});
				
				// initialize
				container.blur();
			}
		});
	};
	$.fn.ztInputHint = $.fn.ztinputhint;
})(jQuery);