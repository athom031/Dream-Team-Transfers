BASE_WEBPAGE = 'https://www.transfermarkt.com'

# webpage tags
A               = 'a'
DATA_SRC        = 'data-src'
DIV             = 'div'
CLASS           = 'class'
HREF            = 'href'
IMG             = 'img'
SPAN            = 'span'
SRC             = 'src'
TABLE           = 'table'
TBODY           = 'tbody'
TD              = 'td'
TITLE           = 'title'
TR              = 'tr'

# Transfermarkt uses German CSS classes. The aliases below preserve the original values
# while documenting what each class means in the parser.
CLASS_CENTERED              = 'zentriert'
CLASS_SHIRT_NUMBER         = 'rueckennummer'
CLASS_MAIN_LINK            = 'hauptlink'
CLASS_RIGHT_ALIGNED        = 'rechts'
CLASS_POSITION_RELATIVE    = 'posrela'
CLASS_FLAG_FRAME           = 'flaggenrahmen'
CLASS_PLAYER_IMAGE_FRAME   = 'bilderrahmen-fixed'
CLASS_NO_BORDER_RIGHT      = 'no-border-rechts'
CLASS_INLINE_TABLE         = 'inline-table'
CLASS_ROW_EVEN             = 'even'
CLASS_ROW_ODD              = 'odd'

# webpage attributes
PLAYER_INFO_TABLE           = CLASS_INLINE_TABLE
PLAYER_KIT_NUMBER           = 'rn_nummer'
PLAYER_NULL_VALUE           = '-'
TEAM_IN_LEAGUE              = f'{CLASS_CENTERED} {CLASS_NO_BORDER_RIGHT}'
PLAYER_IN_TEAM              = [CLASS_ROW_EVEN, CLASS_ROW_ODD]
TEAM_TABLE_CLASS            = 'items'
INVALID_TEAM_CONDITIONAL    = '<'
VALID_TEAM_CONDITIONAL      = 'startseite'
