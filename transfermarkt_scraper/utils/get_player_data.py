from datetime import datetime
# project defined imports
from constants.scrape_config import get_default_player_birth_date
from constants.webpage_tags import (
    A,
    CLASS,
    CLASS_FLAG_FRAME,
    CLASS_MAIN_LINK,
    CLASS_RIGHT_ALIGNED,
    DATA_SRC,
    DIV,
    IMG,
    PLAYER_INFO_TABLE,
    PLAYER_KIT_NUMBER,
    PLAYER_NULL_VALUE,
    SPAN,
    SRC,
    TABLE,
    TD,
    TITLE,
    TR
)

# FULL PLAYER ROW EXAMPLE AS OF 07/10/2026
"""
<tr>
  <td class="zentriert rueckennummer bg_Torwart" title="Goalkeeper">
    <div class="rn_nummer">-</div>
  </td>
  <td class="posrela">
    <table class="inline-table">
      <tr>
        <td rowspan="2">
          <img alt="Djordje Petrovic" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/medium/465555-1775574265.jpg?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Djordje Petrovic"/>
        </td>
        <td class="hauptlink">
          <a href="/djordje-petrovic/profil/spieler/465555">Djordje Petrovic</a>
        </td>
      </tr>
      <tr>
        <td>Goalkeeper</td>
      </tr>
    </table>
  </td>
  <td class="zentriert">08/10/1999 (26)</td>
  <td class="zentriert">
    <img alt="Serbia" class="flaggenrahmen" src="https://tmssl.akamaized.net//images/flagge/verysmall/215.png?lm=1520611569" title="Serbia"/>
  </td>
  <td class="zentriert">
    <a href="/afc-bournemouth/startseite/verein/989" title="AFC Bournemouth">
      <img alt="AFC Bournemouth" src="https://tmssl.akamaized.net//images/wappen/verysmall/989.png?lm=1457991811" title="AFC Bournemouth"/>
    </a>
  </td>
  <td class="rechts hauptlink">
    <a href="/djordje-petrovic/marktwertverlauf/spieler/465555">€28.00m</a>
  </td>
</tr>
"""

# GET_PLAYER_KIT_NUMBER
"""
<td class="zentriert rueckennummer bg_Torwart" title="Goalkeeper">
    <div class="rn_nummer">42</div>
</td>
"""
def get_player_kit_number(col_tag):
    # find the div with class 'rn_nummer'
    div = col_tag.find(DIV, class_=PLAYER_KIT_NUMBER)

    # Extract the number
    kit_number_text = div.text.strip()

    # treat '-' as None
    kit_number = None if kit_number_text == PLAYER_NULL_VALUE else int(kit_number_text)

    return kit_number


def get_player_col_classes(col_tag):
    return col_tag.get(CLASS, [])


def col_has_classes(col_tag, required_classes):
    col_classes = get_player_col_classes(col_tag)
    return all(required_class in col_classes for required_class in required_classes)


def get_flag_img(col_tag):
    for img_tag in col_tag.find_all(IMG):
        img_classes = img_tag.get(CLASS, [])
        img_src = img_tag.get(SRC, '')
        if CLASS_FLAG_FRAME in img_classes or '/flagge/' in img_src:
            return img_tag

    return None


# GET_PLAYER_NAME_POS_AND_PHOTO
"""
<td class="posrela">
    <table class="inline-table">
        <tr>
            <td rowspan="2">
                <img alt="Djordje Petrovic" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/medium/465555-1775574265.jpg?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Djordje Petrovic"/>
            </td>
            <td class="hauptlink">
                <a href="/djordje-petrovic/profil/spieler/465555">Djordje Petrovic</a>
            </td>
        </tr>
        <tr>
            <td>Goalkeeper</td>
        </tr>
    </table>
</td>
"""
def get_player_name_pos_and_photo(col_tag):
    # get player table info
    player_table_tag = col_tag.find(TABLE, class_=PLAYER_INFO_TABLE)
    if player_table_tag is None:
        player_table_tag = col_tag.find(TABLE) or col_tag

    # extract player name from table info tag
    name_tag = player_table_tag.find(A)
    name = name_tag.text.strip() if name_tag else ''

    # extract player position from table info tag
    rows = player_table_tag.find_all(TR)
    if rows:
        position_tag = rows[-1].find(TD)
        position = position_tag.text.strip() if position_tag else ''
    else:
        position = ''

    # extract player photo url from table info tag
    img_tag = player_table_tag.find(IMG)
    portrait = img_tag.get(DATA_SRC) or img_tag.get(SRC) if img_tag else None

    return (name, position, portrait)


# GET_PLAYER_BIRTH_DATE
"""
<td class="zentriert">08/10/1999 (26)</td>
"""
def get_player_birth_date(col_tag, player_col):
    # get just string stored in td field
    td_text = col_tag.text.strip()

    # handle newer Transfermarkt labels such as 'Date of birth: 08/10/1999 (26)'
    if 'Date of birth' in td_text:
        td_text = td_text.split('Date of birth', 1)[1]

    # split text to just get birthday
    birthday = td_text.split(' (')[0].strip()

    # remove common prefixes like 'Date of birth:' or 'Born:'
    for prefix in ['Date of birth:', 'Date of birth', 'Born:', 'Born', ':']:
        if birthday.startswith(prefix):
            birthday = birthday[len(prefix):].strip()

    # convert birthday string to a datetime object
    # academy players may not have birthdays yet in the system so default their birthday
    # to a player who is 17 years old for the configured squad season
    if birthday in {'-', ''}:
        return get_default_player_birth_date()

    for date_format in ['%b %d, %Y', '%d/%m/%Y', '%d.%m.%Y', '%Y-%m-%d']:
        try:
            return datetime.strptime(birthday, date_format)
        except ValueError:
            pass

    raise ValueError(f'Unsupported birth date format: {birthday}')

# GET_PLAYER_NATIONALITY
"""
<td class="zentriert">
    <img alt="Serbia" class="flaggenrahmen" src="https://tmssl.akamaized.net//images/flagge/verysmall/215.png?lm=1520611569" title="Serbia"/>
</td>
"""
def get_player_nationality(col_tag):
    # get first flag image that shows in this column
    img_tag = get_flag_img(col_tag)

    # parse img for nation name and flag url
    (nationality, nat_flag) = (img_tag[TITLE], img_tag[SRC])

    return (nationality, nat_flag)


# GET_PLAYER_MARKET_VALUE
"""
<td class="rechts hauptlink">
    <a href="/djordje-petrovic/marktwertverlauf/spieler/465555">€28.00m</a>
</td>
"""
def get_player_market_value(col_tag):
    # get the a tag which holds market value
    a_tag = col_tag.find(A)

    if(a_tag is None or a_tag.text.strip() == PLAYER_NULL_VALUE):
        # assume this player has no current market value
        # most of the time means its an academy player
        # lets default this market value to 50K 
        return 50 * 1_000

    # get the text within <a> tag
    market_value_text = a_tag.text.strip()

    # remove '€' from market value text and 'k' or 'm' suffix
    market_value_numeric_text = market_value_text[1:-1]

    # add context of if value was in thousand or million euros
    multiplier = 1_000_000 if market_value_text.lower().endswith('m') else 1_000

    # calculate market value in euros
    market_value = float(market_value_numeric_text) * multiplier

    return market_value


def _find_first_matching_cell(cells, matcher):
    for cell in cells:
        if matcher(cell):
            return cell
    return None


def get_player_columns(player_tag):
    td_player_tags = player_tag.find_all(TD, recursive=False)

    if not td_player_tags:
        raise ValueError('No table cells found in player row')

    tag_number_col = _find_first_matching_cell(
        td_player_tags,
        lambda col_tag: col_tag.find(DIV, class_=PLAYER_KIT_NUMBER) is not None,
    )
    tag_player_col = _find_first_matching_cell(
        td_player_tags,
        lambda col_tag: col_tag.find(TABLE, class_=PLAYER_INFO_TABLE) is not None,
    )
    tag_dob_age_col = _find_first_matching_cell(
        td_player_tags,
        lambda col_tag: bool(col_tag.text) and (
            ' (' in col_tag.text or 'Date of birth' in col_tag.text or 'Born:' in col_tag.text
        ),
    )
    tag_nationality_col = _find_first_matching_cell(
        td_player_tags,
        lambda col_tag: get_flag_img(col_tag) is not None,
    )
    tag_market_value_col = _find_first_matching_cell(
        reversed(td_player_tags),
        lambda col_tag: col_has_classes(col_tag, [CLASS_RIGHT_ALIGNED, CLASS_MAIN_LINK]),
    )

    if tag_market_value_col is None and td_player_tags:
        tag_market_value_col = td_player_tags[-1]

    player_cols = [
        tag_number_col,
        tag_player_col,
        tag_dob_age_col,
        tag_nationality_col,
        tag_market_value_col
    ]

    if any(col_tag is None for col_tag in player_cols):
        row_classes = [get_player_col_classes(col_tag) for col_tag in td_player_tags]
        row_text = [col_tag.get_text(' ', strip=True) for col_tag in td_player_tags]
        raise ValueError(f'Unsupported player row format: {row_classes} {row_text}')

    return player_cols


def get_player_data(player_tag):
    (
        tag_number_col,
        tag_player_col,
        tag_dob_age_col,
        tag_nationality_col,
        tag_market_value_col
    ) = get_player_columns(player_tag)
        
    # 0 - tag_number_col: kit_number
    kit_number = get_player_kit_number(tag_number_col)
    # 1 - tag_player_col: name, position, portrait
    (name, position, portrait) = get_player_name_pos_and_photo(tag_player_col)
    # 2 - tag_dob_age_col: birthdate
    birth_date = get_player_birth_date(tag_dob_age_col, tag_player_col)
    # 3 - tag_nationality_col: nationality, nat_flag
    (nationality, nat_flag) = get_player_nationality(tag_nationality_col)
    # 5 - tag_market_value_col: market_value
    market_value = get_player_market_value(tag_market_value_col)
    
    return [
        name,
        market_value,
        kit_number,
        position,
        nationality,
        nat_flag,
        portrait,
        birth_date
    ]
