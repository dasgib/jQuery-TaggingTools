/*
*   Dependencies:
*   ------------
*   jquery.autoGrowInput.js
*
*/

(function($) {
    
    function TagBox(input) {
    
        var self = this;
        var val = input.val();
        var tags = []
        if(val) {
            tags = input.val().split(/\s*,\s*/);
        }
        self.input = input
        self.tagInput = $('<input>', {
            'type' : 'text',
            'keydown' : function(e) {
                if(e.keyCode == 13 || e.keyCode == 188) {
                    $(this).trigger("selectTag");
                    e.preventDefault();
                }
            },
            'blur' : function(e) {
                $(this).trigger("selectTag");
            }
        });
        
        self.tagInput.bind("selectTag", function() {
            if(!$(this).val()) {
                return;
            }
            self.addTag($(this).val());
            $(this).val("");
        });
        
        self.tagbox = $('<ul>', {
            "class" : "tagbox",
            click : function(e) {
                self.tagInput.focus();
            }
        });

        self.tags = []
        
        input.after(self.tagbox).hide();

        self.inputHolder = $('<li class="input">');
        self.tagbox.append(self.inputHolder);
        self.inputHolder.append(self.tagInput);
        self.tagInput.autoGrowInput();
        
        for(tag in tags) {
            self.addTag(tags[tag]);
        }
    }
    
    TagBox.prototype = {
        
        addTag : function(label) {
            
            var self = this;
            // Add tag and handle <> html chars
            var tag = $('<li class="tag">' + $('<div>').text(label).remove().html() + '</li>');
            
            this.tags.push(label);

            tag.append($('<a>', {
                "href" : "#",
                "class": "close",
                "text": "close",
                click: function(e) {
                    e.preventDefault();
                    var index = self.tagbox.find("li").index($(this).parent());
                    self.removeTag(index);
                }
            }));
            self.inputHolder.before(tag);
            self.updateInput();
        },
        removeTag : function(index) {
            
            this.tagbox.find("li").eq(index).remove();
            this.tags.splice(index, 1);
            this.updateInput();
        },
        updateInput : function() {
            
            this.input.val(this.tags.join(","));
        }
    }
    
    $.fn.tagBox = function() {
        
        return this.each(function() {
            
            var input = $(this);
            var tagbox = new TagBox(input);
        });
    }
})(jQuery);