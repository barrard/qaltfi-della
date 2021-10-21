import {To_Number} from '../../components/small_ui_items.js'

export const Property_Edit_Box = ({
  crowdsale,
  current_eth_price,
  DOLLARS_PER_TOKEN
}) => {
  // console.log({
  //   crowdsale, current_eth_price, DOLLARS_PER_TOKEN
  // })
  function photo_count() {
    return crowdsale.photos.length;
  }

  // console.log((photo_count() || crowdsale.main_crowdsale_img) ? true : false)

  // console.log((!photo_count() && !crowdsale.main_crowdsale_img) ? true : false)

  function calculated_amount_tokens() {
    return Math.ceil(crowdsale.dollar_goal / DOLLARS_PER_TOKEN); //TODO hard foded price in USD per token
  }
  function calculated_eth_per_token() {
    // console.log({DOLLARS_PER_TOKEN, current_eth_price})
    // console.log(Math.round((DOLLARS_PER_TOKEN / current_eth_price) * 100000) / 100000)
    return (
      Math.round((DOLLARS_PER_TOKEN / current_eth_price) * 100000) / 100000
    );
  }
  // function calculated_total_eth() {
  //   return (
  //     Math.round(calculated_amount_tokens() * calculated_eth_per_token() * 100000) /
  //     100000
  //   );
  // }
  function calculated_percent_funded() {
    return ((crowdsale.downpayment / crowdsale.dollar_goal) * 100).toFixed(2);
  }
  return (
    <div className="card">
      {(photo_count() || crowdsale.main_crowdsale_img) && (
          <div className="text-center">
            <img
              src={`/static/crowdsale_photos/${crowdsale.main_crowdsale_img}`}
              className="img-fluid"
            />
          </div>
        )}
      {(!photo_count() && !crowdsale.main_crowdsale_img) && (
        <div className="text-center">

          <img src="/static/img/house-placeholder.jpg" className="img-fluid" />
        </div>
      )}

      <div
        className="card-block"
        className="pb-1"
        style={{
          position: "relative",
          paddingBottom: "60px",
          minHeight: "250px"
        }}
      >
        <div className="row">
          <div className="col-12 flex-inline reverse">
            <h6 className="inline">
              <a href={`/crowdsale/${crowdsale.id}`}>
                Tax ID: {crowdsale.tax_id}
              </a>
            </h6>
          </div>
        </div>

        <p className="desc keep-whitespace">
          <strong>Description: </strong>
          {crowdsale.description}
        </p>
        <p className="desc">
          <strong>Home Style: </strong>
          {crowdsale.home_style}
        </p>
        <p className="desc">
          <strong>Contract Type: </strong>
          {crowdsale.shared_equity_agreement_type}
        </p>

        <div className="card-footer text-muted wrap">
          <div className="col text-center my-2">
            <p className="underline-blue mb-1">Downpayment</p>
            <h6 className="mt-0 mb-0">
              $<strong><To_Number num={crowdsale.downpayment}/></strong>
            </h6>
          </div>
          <div className="col text-center my-2">
            <p className="underline-blue mb-1">Goal</p>
            <h6 className="mt-0 mb-0">
              $<strong><To_Number num={crowdsale.dollar_goal} /></strong>
            </h6>
          </div>

          <div className="col text-center my-2">
            <p className="underline-blue mb-1">Tokens</p>
            <h6 className="mt-0 mb-0">
              <strong>
                          <To_Number num={calculated_amount_tokens()} />
              </strong>
            </h6>
          </div>

        </div>
        {/* <div className="col text-center my-2">
          <p className="underline-blue mb-1">Total ETH</p>
          <h6 className="mt-0 mb-0">
            <strong>ETH {calculated_total_eth()}</strong>
          </h6>
        </div> */}

      </div>
      <div
     
        >
          <div className="funding-progress">
            <div
              className="funding-progress-bar"
              role="progressbar"
              style={{ width: `${calculated_percent_funded()}%` }}
              aria-valuenow={calculated_percent_funded()}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <p className="mb-1">{calculated_percent_funded()}% funded</p>
        </div>
    </div>
  );
};
