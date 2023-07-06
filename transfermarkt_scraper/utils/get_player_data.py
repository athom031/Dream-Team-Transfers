from datetime import datetime
# project defined imports
from transfermarkt_scraper.constants.webpage_tags import (
    A,
    DATA_SRC,
    DIV,
    HIDE_FOR_SMALL,
    IMG,
    PLAYER_INFO_TABLE,
    PLAYER_IS_LOAN_IMG,
    PLAYER_KIT_NUMBER,
    PLAYER_NULL_KIT,
    SHOW_FOR_SMALL,
    SPAN,
    SRC,
    TABLE,
    TD,
    TITLE,
    TR
)

# td_player_tags[0] - #
"""
<td class="zentriert rueckennummer bg_Torwart" title="Goalkeeper">
    <div class="tm-shirt-number">
        12
    </div>
</td>
"""
def get_player_kit_number(col_tag):
    # find the div with class tm-shirt-number
    div = col_tag.find(DIV, class_=PLAYER_KIT_NUMBER)

    # Extract the number
    kit_number_text = div.text.strip()

    # treat '-' as None
    kit_number = None if kit_number_text == PLAYER_NULL_KIT else int(kit_number_text)

    return kit_number

# td_player_tags[1] - Player
"""
<td class="posrela" title="">
    <span class="wechsel-kader-wappen hide-for-small">
        <a href="/west-ham-united/startseite/verein/379/saison_id/2022" title="Joined as a winter arrival from: West Ham United; date: Jan 26, 2023; fee: free transfer">
            <img alt="West Ham United" class="" src="https://tmssl.akamaized.net/images/wappen/kaderquad/379.png?lm=1464675260" title="West Ham United"/>
        </a>
    </span>

    <a class="hide-for-small" href="/west-ham-united/startseite/verein/379/saison_id/2022" title="Joined as a winter arrival from: West Ham United; date: Jan 26, 2023; fee: free transfer">
        <img class="wechsel-symbol" height="19px" src="/images/icons/winterzugang_beta_kader.png" width="19px"/>
    </a>

    <table class="inline-table" title="">
        <tr>
            <td class="" rowspan="2">
                <a href="#">
                    <img alt="Darren Randolph" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/small/51321-1667549274.jpg?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Darren Randolph"/>
                </a>
            </td>

            <td class="hauptlink">
                <div class="di nowrap">
                    <span class="hide-for-small">
                        <a
                            href="/darren-randolph/profil/spieler/51321" title="Darren Randolph">Darren Randolph
                        </a>
                    </span>
                </div>

                <div class="di nowrap">
                    <span class="show-for-small">
                        <a
                            href="/darren-randolph/profil/spieler/51321" title="Darren Randolph">D. Randolph
                        </a>
                    </span>
                </div>
            </td>
        </tr>

        <tr>
            <td>
                Goalkeeper
            </td>
        </tr>

    </table>

</td>
"""
def check_if_loan_player(col_tag):
    loan_info = col_tag.find(A, class_=HIDE_FOR_SMALL)

    if loan_info is not None:
        # check img tag for src link matches loan link
        img_tag = loan_info.find(IMG)
        return (img_tag and img_tag.get(SRC) == PLAYER_IS_LOAN_IMG)
    else:
        return False

def get_player_name_pos_and_photo(col_tag):
    # get player table info
    player_table_tag = col_tag.find(TABLE, class_=PLAYER_INFO_TABLE)

    # extract player name from table info tag
    name = player_table_tag.find(SPAN, class_=HIDE_FOR_SMALL).text.strip()

    # extract player shortened name from table info tag
    shortened_name = player_table_tag.find(SPAN, class_=SHOW_FOR_SMALL).text.strip()

    # extract player position from table info tag
    position = player_table_tag.find_all(TR)[-1].find(TD).text.strip()

    # extract player photo url from table info tag
    portrait = player_table_tag.find(IMG)[DATA_SRC]

    return (name, shortened_name, position, portrait)

# td_player_tags[2] - Date of birth / Age
"""
<td
    class="zentriert">May 12, 1987 (35)
</td>
"""
def get_birth_date(col_tag):
    # get just string stored in td field
    td_text = col_tag.text.strip()

    # split text to just get birthday
    birthday, age = td_text.split(' (')

    # convert birthday string to a datetime object
    birth_date = datetime.strptime(birthday, '%b %d, %Y')

    return birth_date

# td_player_tags[3] - Nationality
"""
<td class="zentriert">
    <img alt="Ireland" class="flaggenrahmen" src="https://tmssl.akamaized.net/images/flagge/verysmall/72.png?lm=1520611569" title="Ireland"/>

    <br/>

    <img alt="United States" class="flaggenrahmen" src="https://tmssl.akamaized.net/images/flagge/verysmall/184.png?lm=1520611569" title="United States"/>
</td>
"""
def get_nationality(col_tag):
    # get first img that shows in this column
    img_tag = col_tag.find(IMG)

    # parse img for nation name and flag url
    (nationality, nat_flag) = (img_tag[TITLE], img_tag[SRC])

    return (nationality, nat_flag)

# td_player_tags[4] - Current Club (TO BE IGNORED)
"""
<td class="zentriert">
    <a href="/afc-bournemouth/startseite/verein/989" title="AFC Bournemouth">
        <img alt="AFC Bournemouth" class="" src="https://tmssl.akamaized.net/images/wappen/verysmall/989.png?lm=1457991811" title="AFC Bournemouth"/>
    </a>
</td>
"""

# td_player_tags[5] - Market Value
"""
<td class="rechts hauptlink">
    <a
        href="/darren-randolph/marktwertverlauf/spieler/51321">€400k
    </a>

    <span
        class="icons_sprite red-arrow-ten" title="Previous market value: €500k">
    </span>
</td>
"""
def get_player_market_value(col_tag):
    # get the a tag which holds market value
    a_tag = col_tag.find(A)

    if(a_tag is None):
        return 0

    # get the text within <a> tag
    market_value_text = a_tag.text.strip()

    # remove '€' from market value text and 'k' or 'm' suffix
    market_value_numeric_text = market_value_text[1:-1]

    # add context of if value was in thousand or million euros
    multiplier = 1_000_000 if market_value_text.endswith('m') else 1_000

    # calculate market value in euros
    market_value = float(market_value_numeric_text) * multiplier

    return market_value


def get_player_data(player_tag):
    td_player_tags = player_tag.find_all(TD, recursive=False)
    # conditions on which player is not valid: either 0 market value or a loan player to be returned back to original club for 23/24
    tag_number_col = td_player_tags[0]
    tag_player_col = td_player_tags[1]
    tag_dob_age_col = td_player_tags[2]
    tag_nationality_col = td_player_tags[3]
    # ignore current club column (td_player_tags[4])
    tag_market_value_col = td_player_tags[5]

    market_value = get_player_market_value(tag_market_value_col)
    is_loan_player = check_if_loan_player(tag_player_col)

    # only get player_data if valid supported player for this team
    if(market_value <= 0 or is_loan_player):
        return None
    else:
        # get player kit number if available
        kit_number = get_player_kit_number(tag_number_col)
        birth_date = get_birth_date(tag_dob_age_col)
        (nationality, nat_flag) = get_nationality(tag_nationality_col)
        (name, shortened_name, position, portrait) = get_player_name_pos_and_photo(tag_player_col)

        return [
            name,
            shortened_name,
            market_value,
            kit_number,
            position,
            nationality,
            nat_flag,
            portrait,
            birth_date
        ]
