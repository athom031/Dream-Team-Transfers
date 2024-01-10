import './HomePage.css';

function HomePage() {
  return (
    <div className='home-page'>

      <div className='title'>
        <h1>
          Dream Team Transfers
        </h1>
      </div>

      <div className='intro'>

        <div className='concept'>
          Concept Introduction goes here!
        </div>

        <div className='slideshow'>
          Slide show will go here!
        </div>

      </div>

      <div className='team-selection'>

        <div className='team-picker'>
          Team Picker goes here!
        </div>

        <div className='selection-summary-and-submit'>

          <div className='team-summary'>
            If team hovered on, budget and roster value will go here
          </div>

          <div className='submit-button'>
            Final Submit button goes here
          </div>

        </div>

      </div>
    </div>
  );
}

export default HomePage;
