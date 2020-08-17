<script>

		$(document).ready(function () {
		
		/*
		 * Fields Limits
		 */

		// Checkboxes limiter
		$("input").change(function () {
			var name = $(this).attr('name');
			var selected = $("select[name="+ name + "]").val();
			var lim = selected.charAt(0);
			var cnt = $("input[name=" + name + "][class='cb-cours']:checked").length;

			if ( lim-cnt < 0 ) {
			$(this).prop("checked", "");
			alert('Vous ne pouvez pas choisir plus de cours');
		}
		});
		});

		// Select Limiter by Context
		$("select").change(function () {
			var name = $(this).attr('name');
			var context = $(this).attr('tag');

			// Select select fields and calculate based on category context
			var samecontext = $("select[tag="+context+"][id='occurence_select']");
			var sameduree = $("select[tag="+context+"][id='duree_select']");
			var base_occu = 0;
			samecontext.each(function(){
				var children = $(this).children(':selected');
				var count = children.attr('id');
				base_occu = Number(base_occu) + Number(count);
			});

			// If User is able to select more than 4 occu , reset fields to x1 and uncheck all boxes
			if( base_occu > 4 ){
				// Alert and reset select index
				alert("Vous ne pouvez pas vous inscrire à plus de 4 séance de la même catégorie, vérifiez que vous ayez bien sélectionné les bons cours ainsi que les bonnes occurences, si votre problème ne proviens pas de là, veuillez contacter l'administration.");
				samecontext.each(function(){
					$(this).prop('selectedIndex', 0);
				})
				// reset checkboxes
				var checkinputs = $("input[id="+context+"]");
				checkinputs.each(function(){
					$(this).prop('checked', '');
				})
				// reset selectbox durees
				sameduree.each(function(){
					$(this).prop('selectedIndex', 0);
				})
			}
		});

		// Delete checked values if user changes occurences
		$(document).ready(function() {
			// remove all checkboxes
			// $('input:checkbox[class="cb-cours"]').removeAttr('checked');
			// set prices
			$("select").change(function () {
			if( $(this).attr('id') == 'occurence_select'){
				var sname = $(this).attr('name');
				$("input[name=" + sname + "][class='cb-cours']").prop("checked","");
			} else {
				// pass
			}
		});
		});

		/*
		 * Manage Prices
		 */

		// Set on-page load prices
		// Variations depending on product context
		$(document).ready(function() {
			var pricelists = $('.context-price');
			pricelists.each(function(){
				var context = $(this).attr('id');
				var pre_name = $(this).attr('name');
				// Display price for loisir/uni/ecole context
				if( context == 'loisir' || context == 'ecole' || context == 'uni' ){
					var duree_array = $("select[tag="+context+"][id='duree_select']").children(':selected');
					var duree_types = [];
					duree_array.each(function(){
						var cur_period = $(this).attr('tag');
						var name = $(this).attr('name');
						var linked_occu = $("select[name="+name+"][id='occurence_select']").children(':selected');
						var linked_val = linked_occu.val().charAt(0);
						if( $.inArray(cur_period, duree_types) < 0 ){
							duree_types.push({cur_period, linked_val, name});
						}
					})
					var loisir_price = 0;
					$.each(duree_types,function(item, value){
						var cur_period = value['cur_period'];
						var occu_count = Number(value['linked_val']) - 1;
						var cours_name = value['name'];
						var select_price = $("option[name="+cours_name+"][tag="+cur_period+"]");
						var current_price = select_price.data('price'+occu_count+'');
						loisir_price = loisir_price + current_price;
					})
					$(this).html(loisir_price+'CHF');
				// Display price for autre context
				} else if( context == 'autre'){
					var autre_price = 0;
					var autre_cours = $("select[tag="+context+"][id='duree_select']").children(':selected');
					autre_cours.each(function(){
						var name = $(this).attr('name');
						var linked_occu = $("select[name="+name+"][id='occurence_select']").children(':selected');
						var current_occu = linked_occu.attr('alt');
						var current_price = $(this).data('price'+current_occu+'');
						autre_price = autre_price + current_price;
					})
					$(this).html(autre_price+'CHF');
				}
			})
		});

		// Update Price on Duration changes
		// Variations depending on product context
		$(document).ready(function() {
			$("select").change(function () {
				if( $(this).attr('id') == 'duree_select'){
					// Variation when occurence changes
					var context = $(this).attr('tag');
					if( context == 'loisir' || context == 'ecole' || context == 'uni' ){
					var duree_array = $("select[tag="+context+"][id='duree_select']").children(':selected');
					var duree_types = [];
					duree_array.each(function(){
						var cur_period = $(this).attr('tag');
						var name = $(this).attr('name');
						var linked_occu = $("select[name="+name+"][id='occurence_select']").children(':selected');
						var linked_val = linked_occu.attr('alt');
						if( $.inArray(cur_period, duree_types) < 0 ){
							duree_types.push({cur_period, linked_val, name});
						}
					})
					var loisir_price = 0;
					$.each(duree_types,function(item, value){
						var cur_period = value['cur_period'];
						var occu_count = Number(value['linked_val']);
						var cours_name = value['name'];
						var select_price = $("option[name="+cours_name+"][tag="+cur_period+"]");
						var current_price = select_price.data('price'+occu_count+'');
						loisir_price = loisir_price + current_price;
					})
					console.log($(".context-"+context+""));
					$("b[id="+context+"]").html(loisir_price+'CHF');
				// Display price for autre context
				} else if( context == 'autre'){
					var autre_price = 0;
					var autre_cours = $("select[tag="+context+"][id='duree_select']").children(':selected');
					autre_cours.each(function(){
						var name = $(this).attr('name');
						var linked_occu = $("select[name="+name+"][id='occurence_select']").children(':selected');
						var current_occu = linked_occu.attr('alt');
						var current_price = $(this).data('price'+current_occu+'');
						autre_price = autre_price + current_price;
					})
					$("b[id="+context+"]").html(autre_price+'CHF');
				}
				}
				if( $(this).attr('id') == 'occurence_select' ){
					// Variation when duree changes
					var context = $(this).attr('tag');
					if( context == 'loisir' || context == 'ecole' || context == 'uni' ){
					var duree_array = $("select[tag="+context+"][id='duree_select']").children(':selected');
					var duree_types = [];
					duree_array.each(function(){
						var cur_period = $(this).attr('tag');
						var name = $(this).attr('name');
						var linked_occu = $("select[name="+name+"][id='occurence_select']").children(':selected');
						var linked_val = linked_occu.attr('alt');
						if( $.inArray(cur_period, duree_types) < 0 ){
							duree_types.push({cur_period, linked_val, name});
						}
					})
					var loisir_price = 0;
					$.each(duree_types,function(item, value){
						var cur_period = value['cur_period'];
						var occu_count = Number(value['linked_val']);
						var cours_name = value['name'];
						var select_price = $("option[name="+cours_name+"][tag="+cur_period+"]");
						var current_price = select_price.data('price'+occu_count+'');
						loisir_price = loisir_price + current_price;
					})
					$("b[id="+context+"]").html(loisir_price+'CHF');
				// Display price for autre context
				} else if( context == 'autre'){
					var autre_price = 0;
					var autre_cours = $("select[tag="+context+"][id='duree_select']").children(':selected');
					autre_cours.each(function(){
						var name = $(this).attr('name');
						var linked_occu = $("select[name="+name+"][id='occurence_select']").children(':selected');
						var current_occu = linked_occu.attr('alt');
						var current_price = $(this).data('price'+current_occu+'');
						autre_price = autre_price + current_price;
					})
					$("b[id="+context+"]").html(autre_price+'CHF');
				}
				}
			});
		});

		/*
		 * Functions
		 */

		// Ajax call to submit the table on backend and process it
		function submit_cours(){

			var resp_buttons = $('.response-button');
			resp_buttons.each(function() {
				$(this).hide(100);
			})

			var list_obj = [];
			var prices_obj = [];

			var occ_colec = $(".occurence_selector");
			occ_colec.each( function() {
				// Setup current object
				var name = $(this).attr('name');
				var cours_object = new Object();
				cours_object.user = <?= $user_id ?>;
				cours_object.slug = name;
				cours_object.time = <?= time(); ?>;

				/* object properties */
				// Occurences
				var current_occu = $(this).val();
				var curr_occu_child = $(this).children(':selected');
				var cours_id = curr_occu_child.attr('tag');
				var cours_name = curr_occu_child.attr('name');
				var occurences = current_occu.charAt(0);
				var selector = Number(occurences) - 1;
				cours_object.name = cours_name;
				cours_object.cours_id = cours_id;
				cours_object.occurences = occurences;

				// Durées - Prix
				var current_duration = $("select[title=" + name + "]").children(':selected');
				var prod_price = current_duration.data('price'+selector+'');
				var prod_duration = current_duration.attr('tag');
				cours_object.duration = prod_duration;
				cours_object.price = prod_price;

				// Jours
				var cours = [];
				var horaires_id = [];
				var inputs = $("input[name=" + name + "]:checked");
				inputs.each( function() {
					cours.push($(this).val());
					horaires_id.push($(this).attr('tag'));
				})
				cours_object.cours = cours;
				cours_object.horaires_id = horaires_id;

				// Push to Master collection
				list_obj.push(cours_object);

			});
			var ajaxlist = JSON.stringify(list_obj);

			var price_collec = $(".context-price");
			price_collec.each(function(){
				var context = $(this).attr('id');
				var the_price = $(this).html();
				var price_array = [ context, the_price];
				prices_obj.push(price_array);
			})
			var pricelist = JSON.stringify(prices_obj);

			$.ajax({
	            url: 'https://obc-geneve.tova.dev/mon-compte/',
	            context: this,
	            method:'POST',
	            data: {
	                testajax : ajaxlist,
					testprice : pricelist
	            },
	            success:function(){
					$('#valid').show(100);
	                console.log(ajaxlist);
					console.log(pricelist);
	            },
	            error:function(result){
					$('#invalid').show(100);
	                console.log('bug');
			        }
			    })
			
			}

	</script>