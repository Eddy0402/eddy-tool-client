$.noty.themes.chatBoxTheme = {
    name: 'chatBoxTheme',
    modal: {
        css: {
            position: 'fixed',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            zIndex: 10000,
            opacity: 0.6,
            display: 'none',
            left: 0,
            top: 0
        }
    },
    style: function() {

        var containerSelector = this.options.layout.container.selector;
        $(containerSelector).addClass('list-group');

        this.$closeButton.append('<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>');
        this.$closeButton.addClass('close');

        this.$bar.addClass( "list-group-item-noty" );

        switch (this.options.type) {
            case 'feed':
                this.$message.prepend('<span class="firstcharacter" style="font-weight:900;color:#CCCCFF">F</span>');
                break;
            case 'virus':
                this.$message.prepend('<span class="firstcharacter" style="font-weight:900;color:#FFFFFF">V</span>');
                break;
            case 'run':
                this.$message.prepend('<span class="firstcharacter" style="font-weight:900;color:#0000FF">R</span>');
                break;
            case 'help':
                this.$message.prepend('<span class="firstcharacter" style="font-weight:900;color:#CCFFCC">H</span>');
                break;
            case 'enemy':
                this.$message.prepend('<span class="firstcharacter" style="font-weight:900;color:#FF0000">E</span>');
                break;
        }

        this.$message.css({
            'font-family': 'cwTeXHei',
            fontSize: '20px',
            lineHeight: '24px',
            textAlign: 'left',
            padding: '8px 10px 9px',
            width: 'auto',
            position: 'relative'
        });

        this.$message.prepend('');

    },
    callback: {
        onShow: function() {  },
        onClose: function() {  }
    }
};
